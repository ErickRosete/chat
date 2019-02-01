const express = require("express");

const app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);

const users = [];
const connections = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  connections.push(socket);
  console.log("user connected");
  console.log(`${connections.length} sockets are still connected`);
  io.emit("adminConnected", true);

  socket.on("join", name => {
    socket.join(name);
    users.push(name);
  });

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log("user disconnected");
    console.log(`${connections.length} sockets are still connected`);
  });

  socket.on("chat", msg => {
    console.log("message: " + msg);
    io.sockets.in(users[0]).emit("chat", "Esto le llegara al primer usuario");
    // socket.emit("chat", "Esto le llegara al socket que te envio el mensaje");
    // io.emit("chat", "Esto le llegara a todos los sockets");
  });
});

server.listen(5000);
console.log("listening...");
