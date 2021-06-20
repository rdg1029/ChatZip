import {Peer} from './peer.js';

const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');
//const socket = io('ADDRESS');

function alertNotReady() {
    window.alert('준비중입니다');
}

createRoom.onclick = alertNotReady;
enterRoom.onclick = alertNotReady;

const peer = new Peer()