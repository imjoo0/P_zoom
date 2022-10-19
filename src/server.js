import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug"); // app.set() function is used to assigns the setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server.
app.set("views",__dirname + "/views");
/*
app.set('views', path.join(__dirname, 'views'));
뷰 페이지의 폴더 기본 경로로 __dirname + views 이름의 폴더를 사용하겠다는 의미입니다.
예를 들어, express-generator로 애플리케이션 명을 foo로 작성했을 경우, foo/views 폴더가 뷰 폴더의 기본 경로가 됩니다.
*/
app.use( "/public",express.static(__dirname + "/public")); //개발에 필요한 기본적인 미들웨어들은 express-generator가 자동으로 등록을 해줍니다. 추가적으로 미들웨어가 필요하다면 이곳에서 작성을 할 수 있습니다.
app.get( "/",(_,res) => res.render("home"));
app.get("/*",(_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss  = new WebSocket.Server({server})

function onSocketClose(){
  console.log("Disconnected from the Browser ❌");
}
function onSocketMessage(message){
  console.log(message);
}

wss.on("connection",(socket)=>{
  console.log("Connected to Browser ✅");
  socket.on("close",onSocketClose);
  socket.on("message",onSocketMessage);
  socket.send("hello!!!");
});

server.listen(3000, handleListen);