const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const bbdd=require('./bbdd.js');
const mysql=require('mysql2/promise')
var nodemailer = require('nodemailer');

app.use(express.static('grafics'));

app.use(cors(
    {"origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
    }
))
app.use(express.json({ strict: false }))
app.listen(PORT, () => {console.log('Server running');});
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22celgariba_admin",
    password: "adminADMIN1",
    database: "a22celgariba_Proj2-G3"
});
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'matesmonoficial@gmail.com',
      pass: 'N1ntendo_'
    }
});

app.get("/preguntas",  function (req, res) {
    numPreguntes=req.body.num
    preguntes= bbdd.obtenirPreguntes(numPreguntes)
    preguntes=JSON.parse(preguntes)
    res.json(preguntes)
})//obtenir un numero n de preguntes
app.post("/login", function (req, res) {
        usuari=req.body.user
        passwd=req.body.passwd
        let usuariTrobat = false;
        autoritzacio = { "autoritzacio": false };
    
    
        usuaris = bbdd.login(connection).then((usuaris) => {
            usuaris = JSON.parse(usuaris)
            for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
    
    
                if (usuaris[i].username == usuari) {
                    if (usuaris[i].contrasenya == passwd) {
                        usuariTrobat = true;
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
app.post("/infoUser", function(req, res){
    usuari=req.body.username
    info=bbdd.ObtenirInfoUsuari(usuari, connection) 
    info=JSON.parse(info)
    res.json(info)
})//obtenir dades personals usuari
app.post("/restablirPasswd", function(req, res){
    usuariActualitzat=req.body.user
    novaContrasenya=req.body.passwd
    bbdd.restablirContrasenya(usuariActualitzat, novaContrasenya, connection)
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
        textCorreu="Hola "+req.body.username+" ens alegra comunicarte que el teu professor a acceptat la teva inscripció al curs, ja pots accedir a "/*+web*/
        +" per poder gaudir mentres aprens"
        bbdd.validarUsuari(req.body.idAlum, connection)
    }
    else{
        textCorreu="Hola "+req.body.username+" sembla ser que el teu professor a denegat l'inscripció al nostre servei, si creus que ha sigut un error pots comunicarte amb ell i tornar a intentar-ho"
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
//------------------cridar aquestes funcions al acabar una partida
function generarGraficsAlumne(alumneDesitjat){ 
    alumne=alumneDesitjat
    dades=bbdd.recollirStatsAlumne(alumne)
    spawn('python3', ["./statsAlumne", dades])
    //crida a python
}//envia estadistiques a un script per poder generar grafics del alumne a android
function generarGraficsClasse(classeDesitjada){ 
    classe=classeDesitjada
    info=bbdd.recollirStatsClasse(classe)
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
function generarGraficsPreguntes(){
    dadesPreguntes=bbdd.recollirStatsPregunta()
    spawn('python3', ["./statsPregunta", dadesPreguntes])
}//envia estadistiques a un script per poder generar grafics de les preguntes