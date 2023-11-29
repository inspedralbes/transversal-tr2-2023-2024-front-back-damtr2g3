const express = require("express");
const socketIO = require("socket.io");
const { join } = require("node:path");
const app = express();
const server = require("http").Server(app);

const io = socketIO(server);

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000");
});
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
