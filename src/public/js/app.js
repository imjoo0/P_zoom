const socket = io();

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