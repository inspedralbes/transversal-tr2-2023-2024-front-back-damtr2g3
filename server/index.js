const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

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
    let lobby_exists = false;

    lobbies.forEach((element) => {
      if (element.lobby_code == data.lobby_code) {
        lobby_exists = true;
      }
    });

    if (!lobby_exists) {
      lobbies.push({
        lobby_code: data.lobby_code,
        subject: data.subject,
        date: new Date().getTime(),
        players: [],
        maxPlayers: data.max_players,
      });

      console.log(lobbies);
      console.log("--------------------")
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
              }
              lobby.players.push(player);
              socket.join(data.lobby_code);
              io.emit("player join", player);
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
          io.to(socket.data.lobby_code).emit("start game");
        }
      }
    });
  });

  socket.on("end game", (data) => {
    lobbies.splice(lobbies.findIndex(lobby => lobby.lobby_code == data.lobby_code), 1 );
    console.log(lobbies);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

function sendPlayerListByLobbyCode(lobby_code) {
  let lobby = lobbies.find((lobby) => lobby.lobby_code == lobby_code);
  if (lobby) {
    return lobby.players;
  }
  return null;
}


function sendLobbyList() {
  io.emit("lobbies list", lobbies);
}

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
