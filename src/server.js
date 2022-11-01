import http from "http"; // 이미 기본 설치되어있음
import WebSocket from "ws"; // 기본설치!
import express from "express"; // npm i express 설치

const app = express(); // app이라는 변수에 가져와서 사용

app.set("view engine", "pug"); // 뷰 엔진을 pug로 하겠다
app.set("views", __dirname + "/views"); // 디렉토리 설정
app.use("/public", express.static(__dirname + "/public")); // public 폴더를 유저에게 공개 (유저가 볼 수 있는 폴더 지정)
app.get("/", (_, res) => res.render("home")); // 홈페이지로 이동할 때 사용될 템플릿을 렌더
app.get("/*", (_, res) => res.redirect("/")) // 홈페이지 내 어느 페이지에 접근해도 홈으로 연결되도록 리다이렉트 (다른 url 사용 안할거라)

const handleListen = () => console.log(`Listening on http://localhost:3000`)
// app.listen(3000, handleListen); // 3000번 포트와 연결

const server = http.createServer(app); // app은 requestlistener 경로 - express application으로부터 서버 생성

const wss = new WebSocket.Server({ server }); // http 서버 위에 webSocket서버 생성, 위의 http로 만든 server는 필수 X - 이렇게 하면 http / ws 서버 모두 같은 3000번 포트를 이용해서 돌릴 수 있다!


function onSocketClose() {
    console.log("Disconnected from the Browser ❌");
}

const sockets = [];
/* 
on method 에서는 event가 발동되는 것을 기다린다. 
event가 connection / 뒤에 오는 함수는 event가 일어나면 작동한다. 
on method는 backend에 연결 된 사람의 정보를 제공하고 그게 socket에서 온다. 
익명 함수로 바꾼다. 
*/
wss.on("connection", socket =>{ // 여기의 socket이라는 매개 변수는 새로운 브라우저를 뜻한다. ( wss 는 전체 서버, socket은 하나의 연결이라고 생각 )
    sockets.push(socket); // 파이어 폭스가 연결되면 sockets배열에 firefox를 넣어준다. ( 다른 브라우저도 마찬가지 )
    socket["nickname"] = "Anonymous"; // 익명 소켓인 경우 처리 - 맨 처음 닉네임은 Anonymous 이다. 
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketClose); // 서버를 끄면 동작 x 
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        /*
        new_message일 때 모든 브라우저에 payload를 전송
        if else 문으로도 대체 가능
        받아 온 string 형태의 메시지( 바로 출력하면 buffer로 뜨지만 )를 parse로 파싱한 후 구분해서 출력한다. 
        */
        switch(message.type){
            case "new_message" :
                sockets.forEach( (aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`)
                );
            case "nickname" :
                socket["nickname"] = message.payload;
        }
        /*
        const utf8message = message.toString("utf8");
        // 버퍼 형태로 전달 되기 때문에 toString 매서드를 이용해서 utf8로 변환이 필요하다. 
        sockets.forEach(aSocket => aSocket.send(utf8message)); // 연결 된 모든 소켓에 메시지를 전달 한다. 
        socket.send(utf8message);
        // 프론트 엔드로부터 메시지가 오면 콘솔에 출력한다. 
        */
    });
});

server.listen(3000, handleListen); // 서버는 ws, http 프로토콜 모두 이해할 수 있게 된다!