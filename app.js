const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(process.env.PORT || 3000);
const io = socketIO(server);
const path = require("path");

var users = {};
var name = '';

app.get('/:name', function (req, res) {
    name = req.params.name;
    res.sendFile(path.join(__dirname,"/index.html"));
});

//socket
io.sockets.on("connection", function (socket) {
    users[socket.id] = name;

    //node room
    socket.on("nRoom", function (room) {
        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " has joined!"); //Broadcast to all the users expect the user joined
    });

    socket.on("node new message", function (data) {
        io.sockets.in("nRoom").emit("node news", users[socket.id] + ": " + data);
    });

    //python room
    socket.on("pRoom", function (room) {
        socket.join(room);
        socket.broadcast.in(room).emit("python new user", users[socket.id] + " has joined!"); //Broadcast to all the users expect the user joined
    });

    socket.on("python new message", function (data) {
        io.sockets.in("pRoom").emit("python news", users[socket.id] + ": " + data);
    });
});