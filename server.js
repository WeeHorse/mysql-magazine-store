// Skapa en express-app (vår server)
const app = require('express')();
// express behöver body-parser för att läsa in request body (som json)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
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
  database : 'magazine_store'
});
// gör om metoderna connect och query till promise-metoder, så vi kan använda async / await
const util = require('util');
db.connect = util.promisify(db.connect);
db.query = util.promisify(db.query);
// Anslut till databasen
db.connect();

////////////
// REST API
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

// servern startas
app.listen(port, () => {
  console.log('server running on port ' + port);
})

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
