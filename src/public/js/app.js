const messageList = document.querySelector("ul");
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector("#message");


// const server = http.createServer(app);
// const wss = new WebSocket.Server({server})

const socket = new WebSocket(`ws://${window.location.host}`);
// continue.addEventListener("click",fn);
// 추가적인 정보를 받은 function이 필요하다
// 브라우저에서 이벤트는 click, submit , ,,,
// wss.on( event, function ) ... 
// wss 
function handleOpen(){
  // console.log("Connected to Server ✅");
  console.log("Disconnected from server ❌")
}
function handleSubmit(event){
  event.preventDefault(); // preventDefault() 메서드는 어떤 이벤트를 명시적으로 처리하지 않은 경우, 해당 이벤트에 대한 사용자 에이전트의 기본 동작을 실행하지 않도록 지정합니다.
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}
messageForm.addEventListener("submit",handleSubmit);

socket.addEventListener("open",handleOpen);

function handleMessage(message){
  console.log("New message: ",message.data )
}
socket.addEventListener("message",handleMessage);
/*
MessageEvent.data Read only
The data sent by the message emitter.

MessageEvent.origin Read only
A string representing the origin of the message emitter.

MessageEvent.lastEventId Read only
A string representing a unique ID for the event.

MessageEvent.source Read only
A MessageEventSource (which can be a WindowProxy, MessagePort, or ServiceWorker object) representing the message emitter.

MessageEvent.ports Read only
An array of MessagePort objects representing the ports associated with the channel the message is being sent through (where appropriate, e.g. in channel messaging or when sending a message to a shared worker).
*/
socket.addEventListener("close",() => {
  console.log("Disconnected from Server ❌");
});

setTimeout( ()=>{
  socket.send("hello from the browser!");
},10000); 