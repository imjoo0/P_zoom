import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine","pug"); // app.set() function is used to assigns the setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("views",__dirname + "/views");

app.get( "/",(_,res) => res.render("home"));
app.get("/*",(_,res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  console.log(socket);
});

// const sockets = [];

// wss.on("connection",(socket)=>{
//   sockets.push(socket);
//   socket["nickname"] = "Annon";
//   console.log("Connected to Browser ✅");
//   socket.on("close",onSocketClose);
//   // socket.on("message",onSocketMessage);
//   socket.on("message",(msg)=>{
//     const message = JSON.parse(msg);
//     switch(message.type){
//       case "new_message" :
//         sockets.forEach( (aSocket)=>
//           aSocket.send(`${socket.nickname}:${message.payload}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
//   // socket.send("hello!!!");
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000,handleListen);
