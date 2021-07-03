import {Peer} from './peer.js';
import {Room} from './room.js';
import {socket} from './socket.js';

const main = document.getElementById('main');
const signage = document.getElementById('signage');
const mainSignage = document.getElementById('contents-main');
const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');
let currentRoom;
let peers = {};

/*
function alertNotReady() {
    window.alert('준비중입니다');
}
*/
socket.on('open', () => {
    //document.getElementById('status').innerHTML = "OPEN";
    console.log('connected!');
});

socket.on('join room', room => {
    currentRoom = room;
    document.body.style.backgroundColor = "#ffffff";
    main.remove();
    const roomName = document.createElement('h1');
    roomName.innerHTML = 'Room : ' + room.id;
    document.body.appendChild(roomName);
});

socket.on('req info', targetId => {
    //console.log(targetId, 'request your info');
    peers[targetId] = new Peer();
    peers[targetId].createOffer(targetId);
});

socket.on('req answer', (offer, targetId) => {
    peers[targetId] = new Peer();
    peers[targetId].createAnswer(offer, targetId)
});

socket.on('recv answer', (answer, targetId) => {
    peers[targetId].receiveAnswer(answer)
})

socket.on('room found', roomId => {
    socket.to(roomId).emit('req info', socket.id);
});

socket.on('room not found', () => {
    window.alert('방을 찾을 수 없습니다');
})

createRoom.onclick = () => {
    const room = new Room(socket.id);
    socket.emit('create room', room);
}
enterRoom.onclick = () => {
    mainSignage.remove();

    const enterSignage = document.createElement('div');
    enterSignage.id = 'contents-enter';

    const typeRoomId = document.createElement('input');
    typeRoomId.id = 'type-room-id';
    typeRoomId.type = 'text';

    const enterButton = document.createElement('button');
    enterButton.id = 'enter';
    enterButton.textContent = '입장';
    enterButton.onclick = () => {
        if(typeRoomId.value == "") {
            window.alert("방 아이디를 입력해주세요");
            return;
        }
        socket.emit('find room', typeRoomId.value);
    }

    signage.appendChild(enterSignage);
    enterSignage.appendChild(typeRoomId);
    enterSignage.appendChild(enterButton);
}