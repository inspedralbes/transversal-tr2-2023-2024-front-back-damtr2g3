const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    poolSize: 15,
  },
});

let lobbies;
const dbName = "G3-Proj2";

async function connectToDb() {
  return new Promise((resolve, reject) => {
    client.connect()
      .then(() => {
        let database = client.db(dbName);
        lobbies = database.collection('partides');
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function insertLobby(lobby) {
  return new Promise((resolve, reject) => {
    lobbies.insertOne(lobby)
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function getLobbies() {
  return new Promise((resolve, reject) => {
    lobbies.find().toArray()
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function findLobby(lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function lobbyExists(lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function addPlayerToLobby(lobby_code, player) {
  return new Promise((resolve, reject) => {
    lobbies.updateOne(
      { lobby_code: lobby_code },
      { $push: { players: player } }
    )
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function isPlayerNameAvailable(lobby_code, player_name) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        if (result.players.some((player) => player.name === player_name)) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function isLobbyFull(lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        if (result.players.length >= result.maxPlayers) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function isThereAnyLobby() {
  return new Promise((resolve, reject) => {
    lobbies.findOne()
      .then(result => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function deleteLobby(lobby_code) {
  console.log("Deleting lobby: " + lobby_code);
  return new Promise((resolve, reject) => {
    lobbies.deleteOne({ lobby_code: lobby_code })
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function playerReady(current_lobby_code, current_player_name) {
  return new Promise((resolve, reject) => {
    lobbies.updateOne(
      { lobby_code: current_lobby_code, "players.name": current_player_name },
      { $set: { "players.$.ready": true } }
    )
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function checkAllReady(current_lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: current_lobby_code })
      .then(result => {
        console.log(result);
        if (result.players.every((player) => player.ready)) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function leaveLobby(current_lobby_code, current_player_name) {
  return new Promise((resolve, reject) => {
    lobbies.updateOne(
      { lobby_code: current_lobby_code },
      { $pull: { players: { name: current_player_name } } }
    )
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function getPlayersByLobbyCode(lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        resolve(result.players);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function increaseScore(lobby_code, player_name, amount) {
  return new Promise((resolve, reject) => {
    lobbies.updateOne(
      { lobby_code: lobby_code, "players.name": player_name },
      { $inc: { "players.$.score": amount } }
    )
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function playerFinished(lobby_code, player_name) {
  return new Promise((resolve, reject) => {
    lobbies.updateOne(
      { lobby_code: lobby_code, "players.name": player_name },
      { $set: { "players.$.status": "finished" } }
    )
      .then(result => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

async function checkAllFinished(lobby_code) {
  return new Promise((resolve, reject) => {
    lobbies.findOne({ lobby_code: lobby_code })
      .then(result => {
        if (result.players.every((player) => player.status === "finished")) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

module.exports = { client, dbName, connectToDb, insertLobby, getLobbies, lobbyExists, addPlayerToLobby, isPlayerNameAvailable, isLobbyFull, isThereAnyLobby, deleteLobby, 
  findLobby, playerReady, checkAllReady, leaveLobby, getPlayersByLobbyCode, increaseScore, playerFinished, checkAllFinished };
