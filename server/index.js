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

const { connectToDb, insertLobby, getLobbies, lobbyExists, addPlayerToLobby, isPlayerNameAvailable, isLobbyFull, isThereAnyLobby, deleteLobby, findLobby} = require("./partides_mongo.js");
const { join } = require("path");
const { connect } = require("http2");



app.use(bodyParser.json());
app.use(cors());

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

let lobbies = [
  //Lobby d'exemple per fer proves
  {
    lobby_code: "12177",
    subject: 'Nombres i operacions',
    date: 1701768082703,
    players: [
      {
        name: "Player1",
        score: 42,
        status: "active"
    },
    {
        name: "Player2",
        score: 85,
        status: "inactive"
    },
    {
        name: "Player3",
        score: 73,
        status: "active"
    }
    ],
    maxPlayers: 5
  },
];

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
        let jugadors = sendPlayerListByLobbyCode(data);
        if(jugadors!=null){
          io.to(socket.id).emit("players list", jugadors);
        } else {
          io.to(socket.id).emit("players error");
        }
      });
    
      socket.on("newLobby", (data) => {
        lobbyExists(data.lobby_code).then((result) => {
          let lobby_exists = result;
          if (!lobby_exists) {
            console.log("New lobby created");
            let lobby = {
              lobby_code: data.lobby_code,
              subject: data.subject,
              date: new Date().getTime(),
              players: [],
              maxPlayers: data.max_players,
            };
            insertLobby(lobby).then((result) => {
              sendLobbyList();
            });
            
          } else {
            io.to(socket.id).emit("Lobby exists", data);
          }
        });
      });
    
      socket.on("join lobby", (data) => {
        let connectionError = false;

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
          // Handle any errors that occurred while executing the promises
          console.error(error);
        });
      });
    
      socket.on("ready user", () => {
        let readyUsers = 0;
    
        lobbies.forEach((lobby) => {
          if ((lobby.lobby_code = socket.data.lobby_code)) {
            lobby.players.forEach((player) => {
              if (player.name == socket.data.name) {
                player.ready = true;
              }
            });
            lobby.players.forEach((player) => {
              if (player.ready) {
                readyUsers++;
              }
            });
            if (readyUsers == lobby.players.length) {
              io.to(socket.data.lobby_code).emit("start countdown");
              setTimeout(() => {
                io.to(socket.data.lobby_code).emit("start game");
              }, 5000);
            }
          }
        });
      });
    
      socket.on("end game", (data) => {
        console.log(data);
        deleteLobby(data).then((result) => {
          sendLobbyList();
        });
      });
      
      socket.on("leave lobby", () => {
        let lobby = lobbies.find(
          (lobby) => lobby.lobby_code == socket.data.current_lobby
        );
        if (lobby) {
          lobby.players = lobby.players.filter(
            (player) => player.name != socket.data.name
          );
          io.to(socket.data.current_lobby).emit("player list", lobby.players);
        }
      });
    
      socket.on("disconnect", () => {
        let lobby = lobbies.find(
          (lobby) => lobby.lobby_code == socket.data.current_lobby
        );
        if (lobby) {
          lobby.players = lobby.players.filter(
            (player) => player.name != socket.data.name
          );
          io.to(socket.data.current_lobby).emit("player list", lobby.players);
        }
      });
    
      socket.on("player ready", (player) => {
        let readyUsers = 0;
    
        lobbies.forEach((lobby) => {
          if (lobby.lobby_code === socket.data.current_lobby) {
            lobby.players.forEach((player) => {
              if (player.name === socket.data.name) {
                player.ready = true;
              }
            });
            lobby.players.forEach((player) => {
              if (player.ready) {
                readyUsers++;
              }
            });
            if (readyUsers === lobby.players.length) {
              io.to(socket.data.current_lobby).emit("player list", lobby.players);
              io.to(socket.data.current_lobby).emit("start game");
            } else {
              io.to(socket.data.current_lobby).emit("player list", lobby.players);
            }
          }
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });


function sendPlayerListByLobbyCode(lobby_code) {
  let lobby = lobbies.find((lobby) => lobby.lobby_code == lobby_code);
  if (lobby) {
    return lobby.players;
  }
  return null;
}

function sendPlayerList(socket) {
  let currentLobby = lobbies.find(
    (lobby) => lobby.lobby_code == socket.data.current_lobby
  );
  if (currentLobby) {
    io.to(socket.data.current_lobby).emit("player list", currentLobby.players);
  }
}

function sendQuestions(socket) {
  let currentLobby = lobbies.find(
    (lobby) => lobby.lobby_code == socket.data.current_lobby
  );
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
