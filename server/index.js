const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');




const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' }, maxHttpBufferSize : 1e8 });

app.use(cors({ origin: 'https://party-synker-client.vercel.app/' }));

app.get('/', (req, res) => {
  res.json({ msg: "hello from the backend!!!" });
});

app.get('/admin', (req, res) => {
  res.json({ msg: "hello admin, from the backend!!!" });
});



for(let i =0;i<4;i++)
{
  
  setTimeout(()=>{
  const now= new Date();
   console.log(now.getTime())},i*1000)

}






io.on('connection', (socket) => {

  // Handle incoming audio stream
  socket.on('ReqAudio', () => {
    const song=fs.readFileSync("./smack.mp3");

    socket.emit('song', song); 
    

    console.log("audio sent");


      
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
