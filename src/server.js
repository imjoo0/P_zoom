import http from "http"; // 기본 설치 
import SocketIO from "socket.io";
import express from "express"; // npm i express

const app = express(); // app 변수에 가져와서 사용 

app.set("view engine","pug"); // 뷰엔진을 pug로 설정 
app.set("views",__dirname+"/views"); // 디렉토리 설정 
app.use("/public", express.static(__dirname + "/public")); // public 폴더를 유저에게 공개 ( 유저가 볼 수 있는 폴더 지정 )
app.get("/", (_, res) => res.render("home")); // 홈페이지로 이동할 때 사용될 템플릿을 렌더 
app.get("/*", (_, res) => res.redirect("/")); // 홈페이지 내 어느 페이지에 접근해도 홈으로 연결되도록 리다이렉트 ( 다른 url 사용 안 할 거라 ) 

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); // app은 requestlistener 경로 - express application 으로 부터 서버 생성 
const wsServer = SocketIO(httpServer); // localhost:3000/socket.io/socket.io.js로 연결 가능 (socketIO는 websocket의 부가기능이 아니다!!)

//websocket에 비해 개선 1 . 어떤 이벤트 든지 전달이 가능 하다. 2. JSobject를 보낼 수 있다. 
wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    
    socket.onAny( (event)=>{ // 미들웨어 같은 존재 , 어느 이벤트에서든지 console.log 할 수 있음. 
        console.log(`Socket Event: ${event}`);
    });

    socket.on("enter_room",(roomName, done) => { // 여기 있는 done함수는 여기서 실행하지 않는다 - 사용자로부터 함수를 받아와서 사용하면 보안문제가 생길 수 있기 때문에 
        socket.join(roomName); // 현재 들어가 있는 방 표시 ( 기본적으로 User와 Server 사이에 private rooom이 있다. )
        done();
        socket.to(roomName).emit("welcome",socket.nickname); // welcome 이벤트를 roomName에 있는 모든 사람들에게 emit 한 것 
  });

  socket.on("disconnecting", ()=>{ // 클라이언트가 서버와 연결이 끊어지기 전에 마지막 굿바이 메시지를 보낼 수 있다. 
    socket.rooms.forEach( (room) => socket.to(room).emit("bye",socket.nickname)); // 방안에 있는 모두에게 보내기 위해 forEach 
  });

  socket.on("new_message",(msg,room,done)=>{ // 메시지랑 done함수를 받을 것 
    socket.to(room).emit("new_message",msg); // new_message 이벤트를 emit 한다. 방금 받은 메시지가 payload 된다. 
    done();// done은 프론트엔드에서 코드를 실행할 것!! (백엔드에서 작업 다 끝나고!!)
  });
});

httpServer.listen(3000, handleListen);