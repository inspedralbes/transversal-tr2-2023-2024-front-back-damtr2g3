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
  try {
    await client.connect();
    database = client.db('G3-Proj2');
    lobbies = database.collection('partides');
  } catch (err) {
    console.error(err);
  }
}

async function insertLobby(lobby) {
  const result = await lobbies.insertOne(lobby);
  console.log(`New lobby inserted with the following id: ${result.insertedId}`);
}

async function getLobbies() {
  const cursor = lobbies.find();
  const results = await cursor.toArray();
  return results;
}

async function lobbyExists(lobby_code) {
  const lobby = await lobbies.findOne({ lobby_code: lobby_code });
  if (lobby) {
    return true;
  } else {
    return false;
  }
}

module.exports = { connectToDb, insertLobby, getLobbies, lobbyExists };
