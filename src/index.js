import {Peer} from './peer.js';
import {Room} from './room.js';

const main = document.getElementById('main');
const signage = document.getElementById('signage');
const mainSignage = document.getElementById('contents-main');
const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');

const io = require('socket.io-client');
const socket = io('http://localhost:3000');
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
    document.body.style.backgroundColor = "#ffffff";
    main.remove();
    const roomName = document.createElement('h1');
    roomName.innerHTML = 'Room : ' + room.id;
    document.body.appendChild(roomName);
});

createRoom.onclick = () => {
    const room = new Room();
    socket.emit('create room', room);
}
enterRoom.onclick = () => {
    socket.emit('req room', roomId, offer);
}

const peer = new Peer();