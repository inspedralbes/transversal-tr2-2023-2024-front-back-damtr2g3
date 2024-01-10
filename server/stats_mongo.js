const partides_mongo = require("./partides_mongo");

let stats;

async function connectToStats() {
  return new Promise((resolve, reject) => {
    partides_mongo.client
      .connect()
      .then(() => {
        let database = partides_mongo.client.db(partides_mongo.dbName);
        stats = database.collection("StatsAlumnes");
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

async function insertStats(data) {
  return new Promise((resolve, reject) => {
    stats
      .insertOne(data)
      .then((result) => {
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

module.exports = { connectToStats, insertStats };
