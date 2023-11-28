const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const https = require("https");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

const http = require("node:http");
const server = http.createServer(app);

const uri =
  "mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function run() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    db = client.db("G3-Proj2");
  } catch (err) {
    console.error(err);
  }
}

app.get("/getPreguntes", async (req, res) => {
  try {
    const collection = db.collection("preguntas");
    const data = await collection.find().toArray();
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/getPregunta/:id", async (req, res) => {
  try {
    const collection = db.collection("preguntas");
    const data = await collection.findOne({
      id: parseInt(req.params.id),
    });
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.post("/insertPregunta", async (req, res) => {
  try {
    const collection = db.collection("preguntas");
    const result = await collection.insertOne(req.body);
    res.send(result);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/deletePregunta/:id", async (req, res) => {
  try {
    const collection = db.collection("preguntas");
    const result = await collection.deleteOne({ id: parseInt(req.params.id) });
    res.send(result);
  } catch (err) {
    console.error(err);
  }
});

app.put("/updatePregunta/:id", async (req, res) => {
  try {
    const collection = db.collection("preguntas");
    const result = await collection.updateOne(
      { id: parseInt(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch (err) {
    console.error(err);
  }
});

run().catch(console.dir);

const port = 3333;
server.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
