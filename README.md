# MySQL Magazine Store

_Code-along Workshop med Express och MySQL_

Vi bygger upp en webbshop-server med Node.js och MySQL ifrån grunden. Vi utgår alltså inte ifrån någon startpunkt, utan importerar moduler med NPM och använder dem. __*Vi läser dokumentationen för modulerna på npm och utgår ifrån den.*__

Vår applikation får inget eget front-end gränssnitt utan endast ett REST-API, som vi kan interagera med – t ex med hjälp av programmet Postman.

[Postman kan du ladda ner här](https://www.getpostman.com/) och [lära dig om här](https://learning.getpostman.com/) _(Notera att du inte behöver registrera dig eller betala för Postman.)_

Målbilden är ett REST-API som vi kan logga in på, med olika roller, där vi kan skapa data, som t ex nya produkter, lägga saker i varukorg och göra beställningar.


#### Delmoment som vi fokuserar på:

* REST Routes till MySQL (mappa webserver och databas)
* Sessions (binda data till anslutningar)
* Autentisering (Registrering, In- och utloggning)
* ACL - Access Control List (Rättigheter)


#### User Stories

* Som besökare vill jag kunna hitta tidningar.
* Som besökare vill jag kunna lägga till tidningar i en varukorg.
* Som besökare vill jag kunna bli kund.
* Som kund vill jag kunna lägga till tidningar i en varukorg.
* Som kund vill jag kunna beställa tidningar.
* Som kund vill jag kunna betala för tidningar.
* Som kund vill jag kunna se mina beställningar.
* Som admin vill jag kunna lägga till nya tidningar.
* Som admin vill jag kunna se alla beställningar.
* Som superadmin vill jag kunna lägga till admins.
* Som redaktör vill jag kunna skriva om tidningar


#### Moduler vi använder:

* [express](https://www.npmjs.com/package/express)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [mysql](https://www.npmjs.com/package/mysql)
* [express-session](https://www.npmjs.com/package/express-session)
* [util.promisify](https://nodejs.org/dist/latest-v11.x/docs/api/util.html#util_util_promisify_original) i den inbyggda modulen [util](https://nodejs.org/dist/latest-v11.x/docs/api/util.html)


#### Om REST API

_REST (REpresentational State Transfer) API (Application Programming Interface)_

Med ett REST API får vi ett enhetligt gränssnitt för att arbeta med data i alla databastabeller / collections.

##### CRUD

HTTP-metoderna POST (Create) GET (Read) PUT (Update) och DELETE (Delete) kan här användas på routes som följer formen:

	https://localhost:3000/rest/tabellnamn/id

	# exempel:
    https://localhost:3000/rest/users
    https://localhost:3000/rest/users/2
    https://localhost:3000/rest/magazines
    https://localhost:3000/rest/magazines/1

Med HTTP-metod + route kan vi skapa, läsa, ändra eller radera data i med REST API. SQL-databasens motsvarande metoder är INSERT (Create) SELECT (Read) UPDATE (Update) och Delete (Delete).


#### Källkod / kodexempel:

__*Under arbete - så här långt kom vi dag 1: *__

Databasen kan hämtas här: <a href="https://java18.nodehill.se/wp-content/uploads/2019/03/magazine_store.sql_.zip">magazine_store.sql</a>


__Kod till server med express nedan.__ _(Kom ihåg att köra npm install i terminalen.)_

[<button class="btn-small">Ladda hem koden som zip</button>](/wp-content/uploads/2019/03/magazine-store-2.zip)

#### server.js
```js
// Skapa en express-app (vår server)
const app = require('express')();
// express behöver body-parser för att läsa in request body (som json)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// porten vi servar på (som i https://localhost:3000 )
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

// GET läser, ex: https://localhost:3000/magazines,  https://localhost:3000/magazines/2
app.get('/rest/:table/:id?', async (req, res) => {
  let result;
  if(req.params.id){
    result = await db.query("SELECT * FROM ?? WHERE id = ?", [req.params.table, req.params.id]);
  }else{
    result = await db.query("SELECT * FROM ??", [req.params.table]);
  }
  res.json(result);
});

// POST skapar, ex: https://localhost:3000/magazines
app.post('/rest/:table', async (req, res) => {
  let result = await db.query("INSERT INTO ?? SET ?", [req.params.table].concat(req.body));
  res.json(result);
});

// PUT uppdaterar, ex: https://localhost:3000/magazines/2
app.put('/rest/:table/:id', async (req, res) => {
  let result = await db.query("UPDATE ?? SET ? WHERE id = ?", [req.params.table].concat(req.body).concat(req.params.id));
  res.json(result);
});

// DELETE raderar, ex: https://localhost:3000/magazines/2
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
// https://localhost:3000/session-test/name/Ben
// https://localhost:3000/session-test/age/49
// https://localhost:3000/session-test/vocation/rockstar
// https://localhost:3000/session-test/dislike/tubesocks
// https://localhost:3000/session-test
//
// I svaret ifrån servern ska du se att värden du sätter behålles (du kan ackumulera data).
// (Notera att en omstart av servern tömmer session-data)
// Prova att ansluta med olika webbläsare (som olika klienter)
//  och se att varje klient "bär med sig" sin individuella data:

app.get('/session-test/:key?/:val?', async (req, res) => {
  req.session[req.params.key] = req.params.val;
  res.json(req.session);
});
```


