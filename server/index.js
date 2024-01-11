const express = require("express");
const http = require("http");
const mysql=require('mysql2/promise')
var nodemailer = require('nodemailer');

const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId, UUID } = require("mongodb");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { Console, log, trace } = require("console");
const bbdd=require('./bbdd.js');
//app.use(express.static('grafics'));

const lobbies_mongo = require("./partides_mongo.js");
const preguntes_mongo = require("./preguntes_mongo.js");
const stats_mongo = require("./stats_mongo.js");
const socketHandler = require("./socketHandler.js");
const { join } = require("path");
const { connect } = require("http2");
const { stat } = require("fs");
const { send } = require("process");
const { start } = require("repl");
const connection = mysql.createPool({
  host: "dam.inspedralbes.cat",
  user: "a22celgariba_admin",
  password: "adminADMIN1",
  database: "a22celgariba_Proj2-G3"
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matesmonoficial@gmail.com',
    pass: 'yztt nydz bfxh jlyu'
  }
});
app.use(express.json({ strict: false }))
app.use(bodyParser.json());
app.use(cors(
  {"origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
  }
))
const uri =
  "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await lobbies_mongo.connectToDb();
    console.log("Connected to partides database");
    await stats_mongo.connectToStats();
    console.log("Connected to stats database");
    await preguntes_mongo.connectToPreguntes();
    console.log("Connected to preguntes database");
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();

//Gestió de preguntes

app.get("/getPreguntes", async (req, res) => {
  try {
    const result = await preguntes_mongo.getAllPreguntes();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status.send({ message: "Error al obtenir les preguntes" });
  }
});

app.get("/getPregunta/:id", async (req, res) => {
  try {
    const result = await preguntes_mongo.getPregunta(req.params.id);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status.send({ message: "Error al obtenir la pregunta" });
  }
});

app.post("/insertPregunta", async (req, res) => {
  try {
    const result = await preguntes_mongo.insertPregunta(req.body);
    res.send(result);
    console.log("La pregunta ha sigut inserida");
  } catch (err) {
    console.error(err);
    res.status.send({ message: "Error al inserir la pregunta" });
  }
});

app.delete("/deletePregunta/:id", async (req, res) => {
  try {
    const result = await preguntes_mongo.deletePregunta(req.params.id);
    res.send(result);
    console.log("La pregunta ha sigut eliminada");
  } catch (err) {
    console.error(err);
    res.status.send({ message: "Error al eliminar la pregunta" });
  }
});

app.put("/updatePregunta/:id", async (req, res) => {
  try {
    const result = await preguntes_mongo.updatePregunta(
      req.params.id,
      req.body
    );
    res.send(result);
    console.log("La pregunta ha sigut actualitzada");
  } catch (err) {
    console.error(err);
    res.status.send({ message: "Error al actualitzar la pregunta" });
  }
});

app.get("/getUniqueID", async (req, res) => {
  let randomID = Math.floor(Math.random() * 100000000);
  let result = await preguntes_mongo.getPregunta(randomID);

  while (result !== null) {
    randomID = Math.floor(Math.random() * 100000000);
    result = await preguntes_mongo.getPregunta(randomID);
  }

  console.log(randomID);
  res.send({ id: randomID });
});

//Gestió de partides amb sockets i mongo
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("A user connected");
  socketHandler.sendLobbyList(io);

  socketHandler.handleGetLobbies(socket, io);
  socketHandler.handleGetPlayers(socket, io);
  socketHandler.handleNewLobby(socket, io);
  socketHandler.handleJoinLobby(socket, io);
  socketHandler.handlePlayerReady(socket, io);
  socketHandler.handleEndGame(socket, io);
  socketHandler.handleRemovePlayer(socket, io);
  socketHandler.handleLeaveLobby(socket, io);
  socketHandler.handleQuestionAnswered(socket, io);
  socketHandler.handleAnswerData(socket, io);
  socketHandler.handleQuestionsEnded(socket, io);
  socketHandler.handleDisconnect(socket, io);
});


app.post("/login", function (req, res) {
      usuari=req.body.user
      passwd=req.body.passwd
      let usuariTrobat = false;
      autoritzacio = 
      { 
        "autoritzacio": false,
        "idUsuari":""
      };
  
  
      usuaris = bbdd.login(connection).then((usuaris) => {
          usuaris = JSON.parse(usuaris)
          for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
  
  
              if (usuaris[i].username == usuari) {
                  if (usuaris[i].contrasenya == passwd) {
                      if(usuaris[i].autoritzada){
                          usuariTrobat = true;
                          autoritzacio.idUsuari=usuaris[i].idAlum
                      }
                  }
              }
          }
          autoritzacio.autoritzacio = usuariTrobat;
          res.json(autoritzacio)
      })
})//crida al login, return bool sutoritzacio
app.post("/loginProf", function (req, res) {
  usuari=req.body.correu
  passwd=req.body.passwd
  let usuariTrobat = false;
  let id={
      idProf:""
  }

  usuaris = bbdd.loginProf(connection).then((usuaris) => {
      usuaris = JSON.parse(usuaris)
      for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
          if (usuaris[i].correu == usuari) {
              if (usuaris[i].contrasenya == passwd) {
                  usuariTrobat = true;
                  id.idProf=usuaris[i].idProf
              }
          }
      }

      if(usuariTrobat)
          res.json(id)
      else
          res.json(null)
  })
})//crida al login, return id del prof si es true
app.post("/infoUser", async function(req, res){
  console.log(req.body)
  usuari=req.body.username
  info=await bbdd.ObtenirInfoUsuari(usuari, connection) 
  console.log(info)
  info=JSON.parse(info)
  res.json(info)
})//obtenir dades personals usuari
app.post("/restablirPasswd", function(req, res){
  usuariActualitzat=req.body.user
  novaContrasenya=req.body.passwd
  bbdd.CambiarContrasena(usuariActualitzat, novaContrasenya, connection)
})//cambiar la contrasenya existent per una de nova
app.post("/alumnesClasse",async function (req, res) {
  alumnes= await bbdd.dadesAlumnesClasse(req.body.id, connection)
  alumnes=JSON.parse(alumnes)
  res.json(alumnes)
})//passar informacio basica de tots els alumnes d'una classe
app.post("/veureClasses", async function (req, res) {
  console.log("recollint dades");
  classes= await bbdd.classesProf(req.body.idProf, connection)
  console.log(classes)
  classes=JSON.parse(classes)
  res.json(classes)
})//retorna totes les classes d'un profesor
app.post("/registrarUsuari", function (req, res) {
  alumne={
      username:req.body.username,
      nom:req.body.nom,
      contrasenya:req.body.contrasenya,
      fotoPerfil:req.body.fotoPerfil,
      correu:req.body.correu,
      classe:req.body.classe
  }
  bbdd.crearAlumne(alumne, connection)

})//recull les dades i crea un nou usuari
app.post("/autoritzarAlumnes", function(req, res){
  //autoritzacio=boolean, id=idAlumne; username=username alumne
  autoritzacio=req.body.autoritzacio
  console.log(req.body)
  if(autoritzacio){
      textCorreu="Hola "+req.body.username+"! Ens alegra comunicarte que el teu professor a acceptat la teva inscripció al curs, ja pots accedir a "/*+web*/
      +" per poder gaudir mentres aprens"
      bbdd.validarUsuari(req.body.idAlum, connection)
  }
  else{
      textCorreu="Hola "+req.body.username+"! Sembla ser que el teu professor a denegat l'inscripció al nostre servei, si creus que ha sigut un error pots comunicarte amb ell i tornar a intentar-ho"
      bbdd.eliminarUsuari(req.body.idAlum, connection)
  }
  var mailOptions = {
      from: 'matesmonoficial@gmail.com',
      to: req.body.correu,
      subject: 'Inscripcio al joc web Matemon',
      text: textCorreu
  };
  transporter.sendMail(mailOptions, function(error){
      if (error) {console.log(error);} 
  });
  
})//informa al usuari de si ha sigut acceptat o no al sistema i fa els cambis corresponents a la bbdd
app.post("/alumnesPerAutoritzar", async function (req, res){
  console.log(req.body)
  alumnes=await bbdd.ObtenirInscrits(req.body.curs, connection)
  alumnes=JSON.parse(alumnes)
  console.log(alumnes)
  res.json(alumnes)
})//retorna una llista de tots els alumnes que es volen inscriure a una classe determinada
app.get("/obtenirClassesRegistre", async function (req, res){
  classes=await bbdd.revisarClasses(connection)
  //console.log(classes)
  classes=JSON.parse(classes)
  res.json(classes) 
})//envia un llistat de totes les classes per facilitar el registre d'un nou alumne
app.post("/obtenirDadesAlumneVue", function (req, res){
  alumne=req.body.username
  console.log(alumne)
  dades=bbdd.recollirStatsAlumne(alumne)
  console.log(dades)
  res.json(dades)
})//envia estadistiques a vue per generar grafics
app.post("/obtenirStatsTextualsAlumne", function (req, res){
  alumne=req.body.username
  dadesTextuals={
      millor:"",
      pitjor:"",
      avgPuntuacio:""
  }
  dades=bbdd.recollirStatsAlumne(alumne)

  //sumar totes les puntuacions i calcular la mitjana
  let puntuacioTotal = 0
  for(var i=0; i<dades.puntuacio.length; i++){
      puntuacioTotal+=dades.puntuacio[i]
  }
  dadesTextuals=puntuacioTotal/dades.puntuacio.length

  //parsejem les dades en un json auxiliar i el ordenem per ordre
  jsonAuxiliar=[{
      tema:"",
      nota:0
  }]
  for(let i=0; i<dades.stats.length;i++){
      jsonAuxiliar[i].tema=dades.stats[i].tema
      jsonAuxiliar[i].nota=dades.stats[i].acerts/dades.stats[i].errors
  }
  jsonAuxiliar = jsonAuxiliar.sort((a, b) =>  a.nota.localeCompare(b.nota));
  dadesTextuals.millor=jsonAuxiliar[0].tema
  dadesTextuals.pitjor=jsonAuxiliar[jsonAuxiliar.length-1].tema


  res.json(dadesTextuals)
})//transforma diferents dades del json en estadstiques legibles per un usuari
app.post("/colorsGacha", function(req, res){
  console.log("/colorsGacha")
  alumne=req.body.alumne
  data=bbdd.recollirColors(alumne)
  console.log(data)
  res.json(data.backgroud)
})//recolleix tota a info del gacha del usuari i retorna els colors de fons de pantalla
app.post("/obtenirStatsTextualsClasse", function (req, res){
  clase=req.body.classe
  dadesTextuals={
      millor:"",
      pitjor:"",
      avgPuntuacio:""
  }
  dades=bbdd.recollirStatsAlumne(alumne)

  //sumar totes les puntuacions i calcular la mitjana
  let puntuacioTotal = 0
  for(var i=0; i<dades.puntuacio.length; i++){
      puntuacioTotal+=dades.puntuacio[i]
  }
  dadesTextuals=puntuacioTotal/dades.puntuacio.length

  //parsejem les dades en un json auxiliar i el ordenem per ordre
  jsonAuxiliar=[{
      tema:"",
      nota:0
  }]
  for(let i=0; i<dades.stats.length;i++){
      jsonAuxiliar[i].tema=dades.stats[i].tema
      jsonAuxiliar[i].nota=dades.stats[i].acerts/dades.stats[i].errors
  }
  jsonAuxiliar = jsonAuxiliar.sort((a, b) =>  a.nota.localeCompare(b.nota));
  dadesTextuals.millor=jsonAuxiliar[0].tema
  dadesTextuals.pitjor=jsonAuxiliar[jsonAuxiliar.length-1].tema


  res.json(dadesTextuals)
})//transforma diferents dades del json en estadstiques legibles per un usuari


async function generarGraficsAlumne(alumneDesitjat){ 
  alumne=await bbdd.ObtenirInfoUsuari(alumneDesitjat)
  alumne=JSON.parse(alumne)
  idAlumne=alumne.idAlum
  dades=await bbdd.recollirStatsAlumne(idAlumne)
  spawn('python3', ["./statsAlumne", dades])
  //crida a python
}//envia estadistiques a un script per poder generar grafics del alumne a android
async function generarGraficsClasse(classeDesitjada){ 
  classe=classeDesitjada
  info=await bbdd.recollirStatsClasse(classe)
  const infoParsejada = {
      idClasse:info.idClasse
  };
  info.forEach((estudiant) => {
      estudiant.Stats.forEach((estadistica) => {
          if (!infoParsejada[estadistica.tema]) {
              infoParsejada[estadistica.tema] = { Acerts: 0, Errors: 0 };
          }
          infoParsejada[estadistica.tema].Acerts += estadistica.Acerts;
          infoParsejada[estadistica.tema].Errors += estadistica.Errors;
      });
  })
  spawn('python3', ["./statsClasse", info])
  //crida a python
}//envia estadistiques a un script per poder generar grafics de la classe
async function generarGraficsPreguntes(){
  dadesPreguntes=await bbdd.recollirStatsPregunta()
  spawn('python3', ["./statsPregunta", dadesPreguntes])
}//envia estadistiques a un script per poder generar grafics de les preguntes

module.export={generarGraficsAlumne,generarGraficsClasse,generarGraficsPreguntes }