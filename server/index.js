const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const bbdd=require('./bbdd.js');
const mysql=require('mysql2')

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log('Server running');
});
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22celgariba_admin",
    password: "adminADMIN1",
    database: "a22celgariba_Proj2-G3"
});


app.get("/preguntas", async function (req, res) {
    numPreguntes=req.body.num
    console.log(numPreguntes)
    preguntes=await bbdd.obtenirPreguntes(numPreguntes)
    res.json(preguntes)
})//obtenir un numero n de preguntes
app.post("/login", function (req, res) {
        usuari=req.body.user
        passwd=req.body.passwd
        let usuariTrobat = false;
        autoritzacio = { "autoritzacio": false };
    
    
        usuaris = bbdd.login(usuari, passwd, connection).then((usuaris) => {
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
//comprobar informacio de login
app.post("/infoUser",  function(req, res){
    if(req.body.logged==true){
        usuari=usuari=req.body.user
        info= bbdd.ObtenirInfoUsuari(usuari, connection)
    }
    else{
        info="No autoritzat"
    }
    info=JSON.parse(info)
    res.json(info)
})//obtenir dades personals usuari

app.post("/restablirPasswd", function(req, res){
    usuariActualitzat=req.body.user
    novaContrasenya=req.body.passwd
    bbdd.restablirContrasenya(usuariActualitzat, novaContrasenya, connection)
})

