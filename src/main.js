import {Peer, peers} from './peer.js';
import {room} from './room.js';
import {socket} from './socket.js';

let main, signage, mainSignage, enterSignage, typeRoomId, enterButton, createRoom, enterRoom;
let readyCount = 0;

function initMain() {
    main = document.getElementById('main');
    signage = document.getElementById('signage');
    mainSignage = document.getElementById('contents-main');
    createRoom = document.getElementById('create-room');
    enterRoom = document.getElementById('enter-room');

    createRoom.onclick = () => {
        room.init();
        room.setHost();
        socket.emit('create room', room.id);
    }
    enterRoom.onclick = () => {
        mainSignage.remove();
    
        enterSignage = document.createElement('div');
        enterSignage.id = 'contents-enter';
    
        typeRoomId = document.createElement('input');
        typeRoomId.id = 'type-room-id';
        typeRoomId.type = 'text';
    
        enterButton = document.createElement('button');
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
    setSocketListener();
}

function setSocketListener() {
    socket.on('open', () => {
        //document.getElementById('status').innerHTML = "OPEN";
        console.log('connected!');
    });

    socket.on('room found', roomId => {
        room.id = roomId;
        typeRoomId.remove();
        enterButton.remove();
        const connMsg = document.createElement('p');
        connMsg.innerHTML = '연결 중...';
        enterSignage.appendChild(connMsg);
        socket.emit('req info', roomId, socket.id);
    });
    
    socket.on('room not found', () => {
        window.alert('방을 찾을 수 없습니다');
    });

    socket.on('room info', users => {
        room.users = users;
        console.log(room.users);
        socket.emit('req offer', room.id, socket.id);
    });

    socket.on('req answer', (offer, targetId) => {
        peers[targetId] = new Peer('answer', targetId);
        peers[targetId].createAnswer(offer);
        //room.addUser(targetId);
    });

    socket.on('conn ready', () => {
        ++readyCount;
        console.log('ready count :', readyCount);
        console.log('room users :', room.users.length);
        if(room.users.length == readyCount) {
            console.log('req join!');
            socket.emit('req join', room.id);
        }
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
}

export {initMain};