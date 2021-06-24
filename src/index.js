import {Peer} from './peer.js';
import {Room} from './room.js';

const io = require('socket.io-client');
const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');
const socket = io('ADDRESS');
/*
function alertNotReady() {
    window.alert('준비중입니다');
}
*/
socket.on('open', () => {
    //document.getElementById('status').innerHTML = "OPEN";
    console.log('connected!');
});

createRoom.onclick = () => {
    const room = new Room();
    socket.emit('create room', room.id);
}
enterRoom.onclick = () => {
    socket.emit('req room', roomId, offer);
}

const peer = new Peer();