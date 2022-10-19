const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen(){
  console.log("Connected to Server ✅");
}
socket.addEventListener("open",handleOpen);

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