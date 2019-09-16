//////////
// CONFIG

// Skapa en express-app (vår server)
const app = require('express')();
// express behöver body-parser för att läsa in request body (som json)
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
// porten vi servar på (som i http://localhost:3000 )
const port = 3000;

// Registera session middleware
const session = require('express-session');
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

app.all('DISABLED', async (req, res, next) => {
  if(!req.session.user || !req.session.user.roles){
    let roles = [1];
  }else{
    let roles = req.session.user.roles;
  }
  if(!accessControlList){
    let acl = await db.query("SELECT * FROM access");
    accessControlList = {};
    for(let entry of acl){
      // map the path
      if(!accessControlList[entry.path]){
        accessControlList[entry.path] = {};
      }
      // map each role and its specific rights
      accessControlList[entry.path][entry.role] = [
        entry.create? 'post':'',
        entry.read? 'get':'',
        entry.update? 'put':'',
        entry.delete? 'delete':''
      ];
    }
    // test the users roles against the access control list
    for(let role of roles){
      if(accessControlList[req.path][role].includes(req.method)){
        res.json(req.session.acl[req.path]);
        // denna request matchade, släpp igenom den:
        next();
        return;
      }
    }
    // denna request matchade inte ACL, stoppa den:
    res.sendStatus(403);
  }
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
    res.json({msg:'loggedIn'});
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


// servern startas
app.listen(port, () => {
  console.log('server running on port ' + port);
})
