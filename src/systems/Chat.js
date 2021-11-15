import { userData } from './connection/UserData';

class Chat {
    constructor(peers) {
        this.messages = document.getElementById('messages');
        this.form = document.getElementById('form');
        this.input = document.getElementById('input');

        this.form.addEventListener('submit', e => {
            const inputValue = this.input.value;
            e.preventDefault();
            if(inputValue === "") return;
            const msg = `${userData.name} : ${inputValue}`;
            peers.forEach(peer => {
                peer.sendChat(msg);
            })
            this.showChat(msg);
            this.input.value = "";
        });
    }

    showChat(msg) {
        const message = document.createElement('li');
        message.innerHTML = msg;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

export {Chat};
