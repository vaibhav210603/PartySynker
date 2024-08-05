const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' }, maxHttpBufferSize: 1e8 });

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
  res.json({ msg: "hello from the backend!!!" });
});

app.get('/admin', (req, res) => {
  res.json({ msg: "hello admin, from the backend!!!" });
});

let users = [];

// Function to broadcast the list of users
const updateUsers = () => {
  io.emit('users', users);
};

io.on('connection', (socket) => {
  // Add new user on connection
  users.push(socket.id);
  updateUsers();

  console.log(`User connected: ${socket.id}`);

  // Handle incoming audio request
  socket.on('ReqAudio', () => {
    const song = fs.readFileSync("./HoM.mp3");
    
    // Emit song to all connected users
    io.emit('song', song);

    console.log("Audio sent to all users");
  });

  // Sending the time ahead of 3 seconds
  socket.on('request_time', () => {
    const current_time = new Date().getTime();
    const delayed_time = current_time + 3000;
    
    // Emit the play time to all users
    io.emit('time_to_play_at', delayed_time);

    console.log(`${current_time} is the current time`);
    console.log(`${delayed_time} is the time sent to the client`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove user from the list
    users = users.filter(id => id !== socket.id);
    updateUsers();

    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(5000, () => {
  console.log("Server started at port 5000");
});
