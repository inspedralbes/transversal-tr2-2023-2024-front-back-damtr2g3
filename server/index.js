const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId, UUID } = require("mongodb");
const app = express();
const server = http.createServer(app);
const { v4: uuidv4 } = require("uuid");
const { Console, log, trace } = require("console");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const lobbies_mongo = require("./partides_mongo.js");
const preguntes_mongo = require("./preguntes_mongo.js");
const stats_mongo = require("./stats_mongo.js");
const socketHandler = require("./socketHandler.js");
const { join } = require("path");
const { connect } = require("http2");
const { stat } = require("fs");
const { send } = require("process");
const { start } = require("repl");

app.use(bodyParser.json());
app.use(cors());

const uri =
  "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";

const PORT = process.env.PORT || 3333;

async function startServer(){
  try{
    await lobbies_mongo.connectToDb();
    console.log("Connected to partides database")
    await stats_mongo.connectToStats();
    console.log("Connected to stats database")
    await preguntes_mongo.connectToPreguntes();
    console.log("Connected to preguntes database")
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();

async function getQuestionsBySubject(subject) {
  try {
    const db = lobbies_mongo.client.db("G3-Proj2");
    const collection = db.collection("preguntas");
    const questions = await collection
      .aggregate([
        { $match: { subject: subject } },
        { $sample: { size: 10 } }
      ])
      .toArray();
    return questions;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


//Gestió de preguntes

app.get("/getPreguntes", async (req, res) => {
  try{
    const result = await preguntes_mongo.getAllPreguntes();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status.send({message: "Error al obtenir les preguntes"});
  }
});

app.get("/getPregunta/:id", async (req, res) => {
  try{
    const result = await preguntes_mongo.getPregunta(req.params.id);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status.send({message: "Error al obtenir la pregunta"});
  }
});

app.post("/insertPregunta", async (req, res) => {
  try{
    const result = await preguntes_mongo.insertPregunta(req.body);
    res.send(result);
    console.log("La pregunta ha sigut inserida");
  } catch (err) {
    console.error(err);
    res.status.send({message: "Error al inserir la pregunta"});
  }
});

app.delete("/deletePregunta/:id", async (req, res) => {
  try{
    const result = await preguntes_mongo.deletePregunta(req.params.id);
    res.send(result);
    console.log("La pregunta ha sigut eliminada");
  } catch (err) {
    console.error(err);
    res.status.send({message: "Error al eliminar la pregunta"});
  }
});

app.put("/updatePregunta/:id", async (req, res) => {
  try{
    const result = await preguntes_mongo.updatePregunta(req.params.id, req.body);
    res.send(result);
    console.log("La pregunta ha sigut actualitzada");
  } catch (err) {
    console.error(err);
    res.status.send({message: "Error al actualitzar la pregunta"});
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
  res.send({id: randomID});
});


main();
//Gestió de partides amb sockets i mongo
io.on("connection", async (socket) => {
  console.log("A user connected");
  socketHandler.sendLobbyList();

  socketHandler.handleGetLobbies(socket);
  try {
    const result = await handleGetPlayers(socket);
    io.to(socket.id).emit(result.type, result.data);
  } catch (error) {
    console.log(error);
  }
  socketHandler.handleNewLobby(socket);
  socketHandler.handleJoinLobby(socket);
  socketHandler.handlePlayerReady(socket);
  socketHandler.handleEndGame(socket);
  socketHandler.handleRemovePlayer(socket);
  socketHandler.handleLeaveLobby(socket);
  socketHandler.handleQuestionAnswered(socket);
  socketHandler.handleAnswerData(socket);
  socketHandler.handleQuestionsEnded(socket);
  socketHandler.handleDisconnect(socket);

});


function sendPlayerList(socket) {
  lobbies_mongo.findLobby(socket.data.current_lobby).then((result) => {
    let currentLobby = result;
    if (currentLobby) {
      io.to(socket.data.current_lobby).emit("player list", currentLobby.players);
    }
  });
}

function sendQuestions(socket) {
  lobbies_mongo.findLobby(socket.data.current_lobby).then((result) => {
    let currentLobby = result;
    if (currentLobby) {
      io.to(socket.data.current_lobby).emit(
        "questions received",
        currentLobby.questions
      );
    }
  });
}



