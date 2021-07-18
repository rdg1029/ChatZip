import { setPage } from './page.js';
import {Peer, peers} from './peer.js';
import {room} from './room.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

setPage('main');

/*
function alertNotReady() {
    window.alert('준비중입니다');
}
*/

window.onbeforeunload = e => {
    e.preventDefault()
    return '';
}

socket.on('user join', userId => {
    room.addUser(userId);
    showChat(userId + " joined room");
    console.log(room.users);
});

socket.on('req offer', targetId => {
    //console.log(targetId, 'request your info');
    peers[targetId] = new Peer('offer', targetId);
    peers[targetId].createOffer();
});

socket.on('recv answer', (answer, targetId) => {
    peers[targetId].receiveAnswer(answer);
    //room.addUser(targetId);
    socket.emit('conn ready', targetId);
    console.log(room.users);
});