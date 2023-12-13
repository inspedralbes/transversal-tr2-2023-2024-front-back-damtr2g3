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

let database;
let lobbies;

async function connectToDb() {
  return new Promise((resolve, reject) => {
    client.connect()
      .then(() => {
        database = client.db('G3-Proj2');
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

module.exports = { connectToDb, insertLobby, getLobbies, lobbyExists, addPlayerToLobby, isPlayerNameAvailable, isLobbyFull, isThereAnyLobby, deleteLobby, findLobby };
