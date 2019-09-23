//////////
// CONFIG
//const uuidv4 = require('uuid/v4');
const path = require('path');
// Skapa en express-app (vår server)
const express = require('express');
const app = express();
// express behöver body-parser för att läsa in request body (som json)
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
// porten vi servar på (som i http://localhost:3001 )
const port = 3001;

// Registera session middleware
const session = require('express-session');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(session({
  secret: 'keyboardkitten',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // vi sätter den till false för att vi vill kunna se / debugga den på klienten.
}));

// Konfigurera databasanslutningen
const mysql = require('mysql');
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mysql',
  database : 'magazine_store_acl'
});
// gör om metoderna connect och query till promise-metoder, så vi kan använda async / await
const util = require('util');
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);
// Anslut till databasen
db.connect();

///////////////////////////
// REST API ACCESS CONTROL

// Vi registrerar denna middleware först (ok, efter session), och fångar därmed alla requests.
// Vi väljer att endast släppa igenom requests som tillåts i databasen (whitelisting)
let accessControlList = null;

app.all('/rest/*', async (req, res, next) => {
  console.log('request in acl', req.path, req.method);
  req.pathClean = req.path.replace(/\/$/,'');
  // if(!req.session.cookie.id){
  //   req.session.cookie.id = uuidv4();
  // }
  let roles;
  if(!req.session.user || !req.session.user.roles){
    roles = [1];
  }else{
    roles = req.session.user.roles;
  }
  if(!roles){
    roles = [];
  }
  roles.push(0); // always role 0 = access to paths not limited by roles
  let acl = await db.query("SELECT * FROM access");
  accessControlList = {};
  for(let entry of acl){
    // map the path
    if(!accessControlList[entry.path]){
      accessControlList[entry.path] = {};
    }
    if(!accessControlList[entry.path][entry.role]){
      accessControlList[entry.path][entry.role] = [];
    }
    // map each role and its specific rights
    accessControlList[entry.path][entry.role] = [
      entry.create? 'post':'',
      entry.read? 'get':'',
      entry.update? 'put':'',
      entry.delete? 'delete':''
    ];
  }
  console.log('accessControlList', accessControlList);
  console.log('req.pathClean', req.pathClean);
  console.log('roles', roles);
  // test the users roles against the access control list
  for(let role of roles){
    console.log('match?', accessControlList[req.pathClean][role]);
    // access limited by role and method
    if(accessControlList[req.pathClean][role] && accessControlList[req.pathClean][role].includes(req.method.toLowerCase())){
      // denna request matchade, släpp igenom den:
      console.log('request passed', req.pathClean, req.method.toLowerCase());
      next();
      return;
    }
  }
  // denna request matchade inte ACL, stoppa den:
  console.log('request failed', req.pathClean, req.method.toLowerCase());
  res.status(403).end();
});

// temp upload thingy
app.post('/rest/upload', async(req, res) => {
  console.log('req.body', req.body);
  res.json(req.body);
});

///////////////////////////
// REST API AUTHENTICATION

app.post('/rest/login', async (req, res) => {
  // patch to fetch roles along with the current user
  let user = await db.query("SELECT * FROM users, usersXroles x, roles WHERE email = ? AND roles.id = x.role AND x.user = users.id", [req.body.email]);
  //let user = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
  user = user[0];
  if(user.password == req.body.password){
    req.session.user = user;
    delete(user.password);
    res.json(user);
    return;
  }else{
    res.json({msg:'bad credentials'});
  }
});

app.get('/rest/login', async (req, res) => {
  if(req.session && req.session.user){
    // patch to fetch roles along with the current user
    let user = await db.query("SELECT * FROM users, usersXroles x, roles WHERE email = ? AND password = ? AND roles.id = x.role AND x.user = users.id", [req.session.user.email, req.session.user.password]);
    //let user = await db.query("SELECT * FROM users WHERE email = ? AND password = ?", [req.session.user.email, req.session.user.password]);
    user = user[0];
    if(user){
      delete(user.password);
      res.json(user);
      return;
    }
  }
  res.json({msg:'not logged in'});
});

app.delete('/rest/login', (req, res) => {
  delete(session.user);
  res.json({msg:'not logged in'});
});

/////////////////
// CUSTOM REST routes
app.get('/rest/cart', async (req, res) => {
  let result;
  console.log('/rest/cart route session', req.session);
  if(req.session.user){
    result = await db.query("SELECT * FROM carts WHERE user = ?", [req.session.user.id]);
  }else if(req.session.cookie && req.session.id){
    result = await db.query("SELECT * FROM carts WHERE session = ?", [req.session.id]);
  }
  res.json(result);
});

app.post('/rest/cart', async (req, res) => {
  let result;
  result = await db.query("INSERT INTO carts SET product = ?, amount = ?, session = ?, user = ?", [req.body.product, req.body.amount, req.session.id, req.session.user? req.session.user.id : null]);
  res.json(result);
});



/////////////////
// REST API DATA (the rest of the REST)
// Läs om det i workshoppens artikel

// GET läser, ex: http://localhost:3000/magazines,  http://localhost:3000/magazines/2
app.get('/rest/:table/:id?', async (req, res) => {
  let result;
  if(req.params.id){
    result = await db.query("SELECT * FROM ?? WHERE id = ?", [req.params.table, req.params.id]);
  }else{
    result = await db.query("SELECT * FROM ??", [req.params.table]);
  }
  res.json(result);
});

// POST skapar, ex: http://localhost:3000/magazines
app.post('/rest/:table', async (req, res) => {
  let result = await db.query("INSERT INTO ?? SET ?", [req.params.table].concat(req.body));
  res.json(result);
});

// PUT uppdaterar, ex: http://localhost:3000/magazines/2
app.put('/rest/:table/:id', async (req, res) => {
  let result = await db.query("UPDATE ?? SET ? WHERE id = ?", [req.params.table].concat(req.body).concat(req.params.id));
  res.json(result);
});

// DELETE raderar, ex: http://localhost:3000/magazines/2
app.delete('/rest/:table/:id', async (req, res) => {
  let result = await db.query("DELETE FROM ?? WHERE id = ?", [req.params.table, req.params.id]);
  res.json(result);
});

app.all('/rest/*', async (req, res) => {
  console.log('not found', req.path, req.method);
  res.status(404).end();
});

/////////////////
// SESSION-TEST
//
// Ett litet test av sessions, så att vi kan se att, och hur, det funkar.
// För att testa, skriv olika url:er i stil med
// http://localhost:3000/session-test/name/Ben
// http://localhost:3000/session-test/age/49
// http://localhost:3000/session-test/vocation/rockstar
// http://localhost:3000/session-test/dislike/tubesocks
// http://localhost:3000/session-test
//
// I svaret ifrån servern ska du se att värden du sätter behålles (du kan ackumulera data).
// (Notera att en omstart av servern tömmer session-data)
// Prova att ansluta med olika webbläsare (som olika klienter)
//  och se att varje klient "bär med sig" sin individuella data:

app.get('/session-test/:key?/:val?', async (req, res) => {
  req.session[req.params.key] = req.params.val;
  res.json(req.session);
});

// serve frontend files (all existing files in the client folder will respond)
app.use(express.static( './client/'));
// also catch all remaining requests
// and send them to our index.html file
// because that is how we get virtual routes in the front-end (and front-end 404's)
// use a little regex for that (not match rest)
app.get('*', async(req, res)=>{
  res.sendFile(path.normalize(__dirname + '/client/index.html'));
});


// servern startas
app.listen(port, () => {
  console.log('server running on port ' + port);
})
