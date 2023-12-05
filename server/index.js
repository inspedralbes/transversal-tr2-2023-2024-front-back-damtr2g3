const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const bbdd=require('./bbdd.js');
const mysql=require('mysql2/promise')
var nodemailer = require('nodemailer');

app.use(cors(
    {"origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
    }
))
app.use(express.json());
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
    usuari=req.body.user
    passwd=req.body.passwd
    let usuariTrobat = false;
    let id={
        idProf:""
    }

    usuaris = bbdd.loginProf(connection).then((usuaris) => {
        usuaris = JSON.parse(usuaris)
        for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {
            if (usuaris[i].username == usuari) {
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
    usuari=usuari=req.body.user
    info=bbdd.ObtenirInfoUsuari(usuari, connection) 
    info=JSON.parse(info)
    res.json(info)
})//obtenir dades personals usuari
app.post("/restablirPasswd", function(req, res){
    usuariActualitzat=req.body.user
    novaContrasenya=req.body.passwd
    bbdd.restablirContrasenya(usuariActualitzat, novaContrasenya, connection)
})//cambiar la contrasenya existent per una de nova
app.post("/alumnesClasse", function (req, res) {
    alumnes=bbdd.dadesAlumnesClasse(req.body.classe, connection)
    alumnes=JSON.parse(alumnes)
    res.json(alumnes)
})//passar informacio basica de tots els alumnes d'una classe
app.post("/veureClasses", function (req, res) {
    classes=bbdd.classesProf(req.body.idProf, connection)
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
    autoritzacio=req.body.autoritzacio
    if(autoritzacio){
        textCorreu="Hola "+req.body.username+" ens alegra comunicarte que el teu professor a acceptat la teva inscripció al curs, ja pots accedir a "+web
        +" per poder gaudir mentres aprens"
        bbdd.validarUsuari(req.body.id, connection)
    }
    else{
        textCorreu="Hola "+req.body.username+" sembla ser que el teu professor a denegat l'inscripció al nostre servei, si creus que ha sigut un error pots comunicarte amb ell i tornar a intentar-ho"
        bbdd.eliminarUsuari(req.body.id, connection)
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
app.post("/alumnesPerAutoritzar", function (req, res){
    alumnes=bbdd.ObtenirInscrits(req.body.classe, connection)
    alumnes=JSON.parse(alumnes)
    res.json(alumnes)
})//retorna una llista de tots els alumnes que es volen inscriure a una classe determinada