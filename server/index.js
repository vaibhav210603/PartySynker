const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');
const { connected } = require("process");




const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' }, maxHttpBufferSize : 1e8 });

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
  res.json({ msg: "hello from the backend!!!" });
});

app.get('/admin', (req, res) => {
  res.json({ msg: "hello admin, from the backend!!!" });
});






let users=[];


io.on('connection', (socket) => {

    users.push(socket.id);

    io.emit('users',users)
  // Handle incoming audio stream
  socket.on('ReqAudio', () => {
    const song=fs.readFileSync("./smack.mp3");

    socket.emit('song', song); 
    

    console.log("audio sent to user",);


      
  });

  //sending the time ahead of 3 seconds

  socket.on('request_time',()=>{
    let current_time=new Date();
    let delayed_time=current_time.getTime()+3000;
    io.emit('time_to_play_at',delayed_time);
    console.log(current_time.getTime(), "is the current time")
    console.log(delayed_time," is the time sent the the client")
  })

  socket.on('disconnect', () => {
  });
});

httpServer.listen(5000, () => { 
  console.log("server started at port 5000");
});