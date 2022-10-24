const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("form");
const messageFrom = document.querySelector("#message");
const nickForm = document.querySelector('#nick');
const socket = new WebSocket(`ws://${window.location.host}`);

// const server = http.createServer(app);
// const wss = new WebSocket.Server({server})

function makeMessage(type,payload){
  const msg = {type,payload};
  return JSON.stringify(msg)
}

function handleOpen(){
  console.log("Connected to Server ✅");
}

socket.addEventListener("open",handleOpen);

socket.addEventListener("message",(message)=>{
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close",()=>{

  function handleSubmit(event){
    event.preventDefault(); // preventDefault() 메서드는 어떤 이벤트를 명시적으로 처리하지 않은 경우, 해당 이벤트에 대한 사용자 에이전트의 기본 동작을 실행하지 않도록 지정합니다.
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
    input.value = "";
  }

  function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.value="";
  }

  messageForm.addEventListener("submit",handleSubmit);
  nickForm.addEventListener("submit",handleNickSubmit);

})


function handleMessage(message){
  console.log("New message: ",message.data )
}
socket.addEventListener("message",handleMessage);

socket.addEventListener("close",() => {
  console.log("Disconnected from Server ❌");
});

setTimeout( ()=>{
  socket.send("hello from the browser!");
},10000); 