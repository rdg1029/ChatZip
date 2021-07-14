import {socket} from './socket.js';
import {peers} from './peer.js';

let chat, messages, form, input;

function initChat() {
    chat = document.getElementById('chat');
    messages = document.getElementById('messages');
    form = document.getElementById('form');
    input = document.getElementById('input');

    form.addEventListener('submit', e => {
        e.preventDefault();
        if(input.value == "") return;
        const msg = socket.id + " : " + input.value;
        for (const peer in peers) {
            peers[peer].sendData(msg);
        }
        showChat(msg);
        input.value = "";
    });
}

function showChat(msg) {
    const message = document.createElement('li');
    message.innerHTML = msg;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

export {initChat, showChat};