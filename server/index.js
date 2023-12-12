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

const { connectToDb, insertLobby, getLobbies, lobbyExists } = require("./partides_mongo.js");

connectToDb();

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
    let lobby_exists = lobbyExists(data.lobby_code);

    if (!lobby_exists) {
      let lobby = {
        lobby_code: data.lobby_code,
        subject: data.subject,
        date: new Date().getTime(),
        players: [],
        maxPlayers: data.max_players,
      };
      insertLobby(lobby);
      sendLobbyList();
    } else {
      io.to(socket.id).emit("Lobby exists", data);
    }
  });

  socket.on("join lobby", (data) => {
    let available = true;
    let connectionError = false;

    if (lobbies.length > 0) {
      lobbies.forEach((lobby) => {
        if (lobby.lobby_code == data.lobby_code) {
          if (lobby.players.length < lobby.maxPlayers) {
            lobby.players.forEach((player) => {
              if (player.name == data.name) {
                available = false;
              }
            });
            if (available) {
              let player = {
                lobby_code: data.lobby_code,
                name: data.name,
                score: 0,
                status: "connected",
                ready: false,
              }
              lobby.players.push(player);
              socket.join(data.lobby_code);
              io.emit("player join", player);
              socket.join(data.lobby_code);
              socket.data.current_lobby = data.lobby_code;
              socket.data.name = data.name;
              sendPlayerList(socket);
              sendQuestions(socket);
            } else {
              connectionError = true;
              io.to(socket.id).emit("connection error", {
                errorMsg: "Name not available",
              });
            }
          } else {
            connectionError = true;
            io.to(socket.id).emit("connection error", {
              errorMsg: "Lobby is full",
            });
          }
        } else {
          connectionError = true;
          io.to(socket.id).emit("connection error", {
            errorMsg: "Lobby not found",
          });
        }
      });
    } else {
      connectionError = true;
      io.to(socket.id).emit("connection error", {
        errorMsg: "No lobbies found",
      });
    }
    console.log(lobbies);
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
    lobbies.splice(lobbies.findIndex(lobby => lobby.lobby_code == data.lobby_code), 1 );
    console.log(lobbies);
    sendLobbyList();
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
    console.log(lobbies);
  });
}

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
