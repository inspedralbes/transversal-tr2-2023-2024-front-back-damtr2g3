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

let lobbies = [];

io.on("connection", (socket) => {
  // console.log("A user connected");

  socket.on("get lobbies", () => {
    sendLobbyList();
  });

  socket.on("newLobby", async (data) => {
    let lobby_exists = false;
    let randomQuestions = await getQuestions();

    lobbies.forEach((element) => {
      if (element.lobby_code == data.lobby_code) {
        lobby_exists = true;
      }
    });

    if (!lobby_exists) {
      lobbies.push({
        lobby_code: data.lobby_code,
        subject: data.subject,
        questions: { randomQuestions },
        date: new Date().getTime(),
        players: [],
        maxPlayers: data.max_players,
      });
    }

    // console.log(lobbies);
    sendLobbyList();
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
              lobby.players.push({
                name: data.name,
                playerID: data.playerID,
                score: 0,
                status: "connected",
                ready: false,
              });
              socket.join(data.lobby_code);
              socket.data.current_lobby = data.lobby_code;
              socket.data.name = data.name;
              socket.data.id = data.playerID;
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

    // console.log(lobbies);
  });

  socket.on("ready user", () => {
    let readyUsers = 0;

    lobbies.forEach((lobby) => {
      if (lobby.lobby_code === socket.data.lobby_code) {
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
        if (readyUsers == lobby.players.length) {
          io.to(socket.data.lobby_code).emit("start countdown");
          setTimeout(() => {
            io.to(socket.data.lobby_code).emit("start game");
          }, 5000);
        }
      }
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

  socket.on("question answered", (data) => {
    let lobby = lobbies.find(
      (lobby) => lobby.lobby_code == socket.data.current_lobby
    );
    if (lobby) {
      let player = lobby.players.find(
        (player) => player.name == socket.data.name
      );
      if (player) {
        if (data.correcta) {
          player.score += 10;
        }
        io.to(socket.data.current_lobby).emit("player list", lobby.players);
      }
    }
  });

  socket.on("answer data", (data) => {
    let lobby = lobbies.find(
      (lobby) => lobby.lobby_code == socket.data.current_lobby
    );
    if (lobby) {
      let player = lobby.players.find(
        (player) => player.name == socket.data.name
      );
      if (player) {
        if (!player.answerData) {
          player.answerData = [];
        }
        player.answerData.push(data);
        console.log(player);
      }
    }
  });

  let playersFinished = 0;
  socket.on("questions ended", () => {
    let lobby = lobbies.find(
      (lobby) => lobby.lobby_code == socket.data.current_lobby
    );

    if (lobby) {
      let player = lobby.players.find(
        (player) => player.name == socket.data.name
      );

      if (player) {
        player.status = "finished";
      }

      playersFinished++;
    }
  });
});

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
  io.emit("lobbies list", lobbies);
}

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
