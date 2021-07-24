import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility.js';
import { setPage } from './page.js';
import {Peer, peers} from './peer.js';
import {group} from './group.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

const compatibilityCheckResult = compatibilityCheck();
if(compatibilityCheckResult == 'done') {
    setPage('main');
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

/*
function alertNotReady() {
    window.alert('준비중입니다');
}
*/
/*
window.onbeforeunload = e => {
    e.preventDefault()
    return '';
}
*/
socket.on('user join', userId => {
    group.addUser(userId);
    showChat(userId + " joined group");
    console.log(group.users);
});

socket.on('req offer', targetId => {
    //console.log(targetId, 'request your info');
    peers[targetId] = new Peer('offer', targetId);
    peers[targetId].createOffer();
});

socket.on('recv answer', (answer, targetId) => {
    peers[targetId].receiveAnswer(answer);
    //group.addUser(targetId);
    socket.emit('conn ready', targetId);
    console.log(group.users);
});

socket.on('user quit', userId => {
    peers[userId].close();
    peers[userId] = null;
    delete peers[userId];
    group.removeUser(userId);
    showChat(userId + " quit");
    console.log('closed with :', userId);
    console.log(group.users);
});