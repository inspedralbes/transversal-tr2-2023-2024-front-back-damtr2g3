const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser')
const path = require("path");
const { spawn } = require('child_process');
var session = require('express-session')
const bbdd=require('./bbdd.js');


app.get("/preguntas", function (req, res) {
    numPreguntes=req.params
    preguntes=bbdd.obtenirPreguntes(numPreguntes)
    res.json(preguntes)
})