import {Peer, peers} from './peer.js';
import {room} from './room.js';
import {socket} from './socket.js';

const main = document.getElementById('main');
const signage = document.getElementById('signage');
const mainSignage = document.getElementById('contents-main');
const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');

/*
function alertNotReady() {
    window.alert('준비중입니다');
}
*/
socket.on('open', () => {
    //document.getElementById('status').innerHTML = "OPEN";
    console.log('connected!');
});

socket.on('join room', roomId => {
    room.id = roomId;
    room.addUser(socket.id);
    console.log(room.users);
    document.body.style.backgroundColor = "#ffffff";
    main.remove();
    const roomName = document.createElement('h1');
    roomName.innerHTML = 'Room : ' + room.id;
    document.body.appendChild(roomName);
});

socket.on('req info', targetId => {
    //console.log(targetId, 'request your info');
    peers[targetId] = new Peer('offer', targetId);
    peers[targetId].createOffer();
});

socket.on('req answer', (offer, targetId) => {
    peers[targetId] = new Peer('answer', targetId);
    peers[targetId].createAnswer(offer);
    room.addUser(targetId);
});

socket.on('recv answer', (answer, targetId) => {
    peers[targetId].receiveAnswer(answer);
    room.addUser(targetId);
    console.log(room.users);
})

socket.on('room found', roomId => {
    socket.emit('req info', roomId, socket.id);
});

socket.on('room not found', () => {
    window.alert('방을 찾을 수 없습니다');
})

createRoom.onclick = () => {
    room.init();
    socket.emit('create room', room.id);
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