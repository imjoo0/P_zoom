const socket = io();const socket = io(); // io function은 알아서 socket.io를 실행하고 있는 서버를 찾을 것 

// 방을 만들 것 ( socketio에는 이미 방 기능이 있음 ) 

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; // 처음에는 방안에서 할 수 있는 것들을 안보이게 

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message",input.value,roomName,()=>{
        addMessage(`You:${value}`);
    }); // 백엔드로 new_message 이벤트를 날림, input.value랑 방 이름도 같이 보냄. 
    // 마지막 요소는 백엔드에서 시작시킬 수 있는 함수 
    input.value = "";
}
function showRoom(){ // 방에 들어가면 방 내용이 보이게 
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`; // 저장된 방 이름을 pug의 요소에 전달해서 띄운다. 
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit",handleMessageSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
		// argument 보내기 가능 ( socketIO는 Object 전달 가능 ) 
		// 첫번째는 이벤트명( 아무거나 상관 없음 ) , 두번째는 front-end 에서 전송하는 object( 보내고 싶은 payload), 세번째는 서버에서 호출하는 function 
    socket.emit( // emit의 마지막 요소가 function이면 가능
			"enter_room",
			input.value,
			showRoom //백엔드에서 끝났다는 사실을 알리기 위해 function을 넣고 싶다면 맨 마지막에 넣자 
		); // 1. socketIO를 이용하면 모든 것이 메시지 일 필요가 없다 
			 // 2. client는 어떠한 이벤트든 모두 emit 가능 / 아무거나 전송할 수 있다. ( text가 아니어도 되고 여러개 전송이 가능하다 ) 
    roomName = input.value; // roomName에 입력한 방 이름 저장 
    input.value = "";
}

// 서버는 백엔드에서 function을 호출하지만 function은 front-end에서 실행 됨 
form.addEventListener("submit",handleRoomSubmit);

socket.on("welcome", (user)=>{
    addMessage("${user} arrived!");
});

socket.on("bye", (left)=>{
    addMessage("${left} left! 😂");
});

socket.on("new_message",addMessage); // addMessage만 써도 알아서 msg를 매개 변수로 넣는다. 