import {socket} from './socket.js';
import {peers} from './peer.js';

function initChat() {
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    form.addEventListener('submit', e => {
        e.preventDefault();
        if(input.value == "") return;
        const msg = socket.id + " : " + input.value;
        for (const peer in peers) {
            peers[peer].sendChat(msg);
        }
        showChat(msg);
        input.value = "";
    });
}

function showChat(msg) {
    const messages = document.getElementById('messages');
    const message = document.createElement('li');
    message.innerHTML = msg;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

export {initChat, showChat};