const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { client, connectToDb, insertLobby, getLobbies, lobbyExists, addPlayerToLobby, isPlayerNameAvailable, isLobbyFull, isThereAnyLobby, deleteLobby, 
  findLobby, playerReady, checkAllReady, leaveLobby, getPlayersByLobbyCode} = require("./partides_mongo.js");
const { join } = require("path");
const { connect } = require("http2");

app.use(bodyParser.json());
app.use(cors());

function getQuestions() {
  return new Promise(async (resolve, reject) => {
    try {;
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

app.get("/incrementScore", (req, res) => {
  const { lobbyId, playerName, incrementAmount } = req.query;

  io.emit("increment score", { lobbyId, playerName, incrementAmount });
  res.send("Score incremented");
});

connectToDb()
  .then(() => {
    console.log("Connected to database");
    io.on("connection", (socket) => {
      console.log("A user connected");
      sendLobbyList();
    
      socket.on("get lobbies", () => {
        sendLobbyList();
      });
    
      socket.on("get players", (data) => {
        getPlayersByLobbyCode(data).then((result) => {
          let jugadors = result;
          if(jugadors!=null){
            io.to(socket.id).emit("players list", JSON.stringify(jugadors));
          } else {
            io.to(socket.id).emit("players error");
          }
        });
      });
    
      socket.on("newLobby", (data) => {
        lobbyExists(data.lobby_code).then((result) => {
          let lobby_exists = result;
          if (!lobby_exists) {
            console.log("New lobby created");
            let questions;
            getQuestions().then((result) => {
              questions = result;
              let lobby = {
                lobby_code: data.lobby_code,
                subject: data.subject,
                questions: questions,
                date: new Date().getTime(),
                players: [],
                maxPlayers: data.max_players,
              };
              insertLobby(lobby).then((result) => {
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

        isThereAnyLobby().then((isLobby) => {
          if (!isLobby) {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "No lobbies found",
            });
            throw new Error("No lobbies found");
          } else {
            return lobbyExists(data.lobby_code);
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
              isLobbyFull(data.lobby_code),
              isPlayerNameAvailable(data.lobby_code, data.name)
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
            addPlayerToLobby(data.lobby_code, player).then((result) => {
              socket.join(data.lobby_code);
              io.emit("player join", player);
              socket.join(data.lobby_code);
              socket.data.current_lobby = data.lobby_code;
              socket.data.name = data.name;
              sendPlayerList(socket);
              sendQuestions(socket);
            });
          }
        }).catch((error) => {
          console.error(error);
        });
      });

      socket.on("player ready", (player) => {
        playerReady(player.lobby_code, player.name).then((result) => {
          checkAllReady(player.lobby_code).then((result) => {
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
      deleteLobby(data).then((result) => {
        sendLobbyList();
      });
    });

    socket.on("remove player", (data) => {
      leaveLobby(data.lobby_code, data.name).then((result) => {
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
        if(lobbyExists(socket.data.current_lobby)){
          leaveLobby(socket.data.current_lobby, socket.data.name).then((result) => {
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
    
      socket.on("disconnect", () => {
        if(lobbyExists(socket.data.current_lobby)){
          leaveLobby(socket.data.current_lobby, socket.data.name).then((result) => {
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
  let currentLobby = findLobby(socket.data.current_lobby);
  if (currentLobby) {
    io.to(socket.data.current_lobby).emit("player list", currentLobby.players);
  }
}

function sendQuestions(socket) {
  let currentLobby = findLobby(socket.data.current_lobby);
  if (currentLobby) {
    io.to(socket.data.current_lobby).emit(
      "questions received",
      currentLobby.questions
    );
  }
}

function sendLobbyList() {
  getLobbies().then((lobbies) => {
    io.emit("lobbies list", JSON.stringify(lobbies));
    //console.log(lobbies);
  });
}

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
