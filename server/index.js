const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId, UUID } = require("mongodb");
const app = express();
const server = http.createServer(app);
const { v4: uuidv4 } = require("uuid");
const { Console } = require("console");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const lobbies_mongo = require("./partides_mongo.js");
const preguntes_mongo = require("./preguntes_mongo.js");
const { join } = require("path");
const { connect } = require("http2");

app.use(bodyParser.json());
app.use(cors());

const uri =
  "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    poolSize: 15,
  },
});

function getQuestions() {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const db = client.db("G3-Proj2");
      const collection = db.collection("preguntas");
      const questions = collection
        .aggregate([{ $sample: { size: 10 } }])
        .toArray();
      resolve(questions);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

function getQuestions(subject) {
  return new Promise(async (resolve, reject) => {
    try {;
      const db = lobbies_mongo.client.db("G3-Proj2");
      const collection = db.collection("preguntas");
      const questions = collection
        .aggregate([
          { $match: { subject: subject } },
          { $sample: { size: 10 } }
        ])
        .toArray();
      resolve(questions);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}


//Gestió de preguntes
preguntes_mongo.connectToPreguntes();

app.get("/getPreguntes", async (req, res) => {
  preguntes_mongo.getAllPreguntes().then((result) => {
    res.send(result);
  });
});

app.get("/getPregunta/:id", async (req, res) => {
  preguntes_mongo.getPregunta(req.params.id).then((result) => {
    res.send(result);
  });
});

app.post("/insertPregunta", async (req, res) => {
  preguntes_mongo.insertPregunta(req.body).then((result) => {
    res.send(result);
    console.log("La pregunta ha sigut insertada");
  });
});

app.delete("/deletePregunta/:id", async (req, res) => {
  preguntes_mongo.deletePregunta(req.params.id).then((result) => {
    res.send(result);
    //console.log("La pregunta ha sigut eliminada")
  });
});

app.put("/updatePregunta/:id", async (req, res) => {
  preguntes_mongo.updatePregunta(req.params.id, req.body).then((result) => {
    res.send(result);
    console.log("La pregunta ha sigut actualitzada");
  });
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



//Gestió de partides amb sockets
app.get("/incrementScore", (req, res) => {
  const { lobbyId, playerName, incrementAmount } = req.query;

  io.emit("increment score", { lobbyId, playerName, incrementAmount });
  lobbies_mongo.increaseScore(lobbyId, playerName, parseInt(incrementAmount));
  res.send("Score incremented");
});


const PORT = process.env.PORT || 3333;

lobbies_mongo.connectToDb()
  .then(() => {
    console.log("Connected to database");
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    io.on("connection", (socket) => {
      console.log("A user connected");
      sendLobbyList();
    
      socket.on("get lobbies", () => {
        sendLobbyList();
      });
    
      socket.on("get players", (data) => {
        lobbies_mongo.getPlayersByLobbyCode(data).then((result) => {
          let jugadors = result;
          if(jugadors!=null){
            io.to(socket.id).emit("players list", JSON.stringify(jugadors));
          } else {
            io.to(socket.id).emit("players error");
          }
        });
      });
    
      socket.on("newLobby", (data) => {
        lobbies_mongo.lobbyExists(data.lobby_code).then((result) => {
          let lobby_exists = result;
          if (!lobby_exists) {
            console.log("New lobby created");
            let questions;
            getQuestions(data.subject).then((result) => {
              questions = result;
              let lobby = {
                lobby_code: data.lobby_code,
                subject: data.subject,
                questions: questions,
                date: new Date().getTime(),
                players: [],
                maxPlayers: data.max_players,
              };
              lobbies_mongo.insertLobby(lobby).then((result) => {
                sendLobbyList();
              });
            });
          } else {
            io.to(socket.id).emit("Lobby exists", data);
          }
        });
      });
    
      socket.on("join lobby", (data) => {
        let connectionError = false;
        console.log("joining lobby");

        lobbies_mongo.isThereAnyLobby().then((isLobby) => {
          if (!isLobby) {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "No lobbies found",
            });
            throw new Error("No lobbies found");
          } else {
            return lobbies_mongo.lobbyExists(data.lobby_code);
          }
        }).then((doesLobbyExist) => {
          if (!doesLobbyExist) {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "Lobby not found",
            });
            throw new Error("Lobby not found");
          } else {
            return Promise.all([
              lobbies_mongo.isLobbyFull(data.lobby_code),
              lobbies_mongo.isPlayerNameAvailable(data.lobby_code, data.name)
            ]);
          }
        }).then(([isFull, isNameAvailable]) => {
          if (isFull) {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "Lobby is full",
            });
            throw new Error("Lobby is full");
          }
          if (!isNameAvailable) {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "Name not available",
            });
            throw new Error("Name not available");
          }
          if (!connectionError) {
            let player = {
              lobby_code: data.lobby_code,
              name: data.name,
              score: 0,
              status: "connected",
              ready: false,
            }
            lobbies_mongo.addPlayerToLobby(data.lobby_code, player).then((result) => {
              socket.join(data.lobby_code);
              io.emit("player join", player);
              socket.join(data.lobby_code);
              socket.data.current_lobby = data.lobby_code;
              socket.data.name = data.name;
              sendLobbyList();
              sendPlayerList(socket);
              sendQuestions(socket);
            });
          }
        }).catch((error) => {
          console.error(error);
        });
      });

      socket.on("player ready", (player) => {
        lobbies_mongo.playerReady(player.lobby_code, player.name).then((result) => {
          lobbies_mongo.checkAllReady(player.lobby_code).then((result) => {
            if (result) {
              io.to(socket.data.current_lobby).emit("player list", lobby.players);
              io.to(socket.data.current_lobby).emit("start game");
              io.to(socket.data.lobby_code).emit("start countdown");
              setTimeout(() => {
                io.to(socket.data.lobby_code).emit("start game");
              }, 5000);
            } else {
              io.to(socket.data.current_lobby).emit("player list", lobby.players);
            }
          });
        });
      });
    
    socket.on("end game", (data) => {
      console.log(data);
      lobbies_mongo.deleteLobby(data).then((result) => {
        sendLobbyList();
      });
    });

    socket.on("remove player", (data) => {
      lobbies_mongo.leaveLobby(data.lobby_code, data.name).then((result) => {
        sendPlayerList(socket);
        sendLobbyList();
        let info = {
          name: data.name,
          lobby: data.lobby_code,
        }
        io.emit("player leave", info);
      });
    });
      
      socket.on("leave lobby", () => {
        if(lobbies_mongo.lobbyExists(socket.data.current_lobby)){
          lobbies_mongo.leaveLobby(socket.data.current_lobby, socket.data.name).then((result) => {
            socket.leave(socket.data.current_lobby);
            sendPlayerList(socket);
            sendLobbyList();
            let info = {
              name: socket.data.name,
              lobby: socket.data.current_lobby,
            }
            io.emit("player leave", info);
          });
        }
      });

      socket.on("question answered", data => {
        console.log(data);
        lobbies_mongo.updateScore(data.lobby_code, data.name, data.score).then((result) => {
          sendPlayerList(socket);
        });
      });

      socket.on("answer data", data => {
        lobbies_mongo.addAnswerData(data.lobby_code, data.name, data.answerData).then((result) => {
          console.log("Answer data added");
        });
      });

      socket.on("questions ended", data => {
        lobbies_mongo.playerFinished(data.lobby_code, data.name).then((result) => {
          lobbies_mongo.checkAllFinished(data.lobby_code).then((result) => {
            if (result) {
              io.to(socket.data.lobby_code).emit("end game");
            }
          });
        });
      });
    
      socket.on("disconnect", () => {
        if(lobbies_mongo.lobbyExists(socket.data.current_lobby)){
          lobbies_mongo.leaveLobby(socket.data.current_lobby, socket.data.name).then((result) => {
            socket.leave(socket.data.current_lobby);
            sendPlayerList(socket);
            sendLobbyList();
            let info = {
              name: socket.data.name,
              lobby: socket.data.current_lobby,
            }
            io.emit("player leave", info);
          });
        }
      });
    });   
  })
  .catch((err) => {
    console.error(err);
  });

function sendPlayerList(socket) {
  let currentLobby = lobbies_mongo.findLobby(socket.data.current_lobby);
  if (currentLobby) {
    io.to(socket.data.current_lobby).emit("player list", currentLobby.players);
  }
}

function sendQuestions(socket) {
  let currentLobby = lobbies_mongo.findLobby(socket.data.current_lobby);
  if (currentLobby) {
    io.to(socket.data.current_lobby).emit(
      "questions received",
      currentLobby.questions
    );
  }
}

function sendLobbyList() {
  lobbies_mongo.getLobbies().then((lobbies) => {
    io.emit("lobbies list", JSON.stringify(lobbies));
    //console.log(lobbies);
  });
}

