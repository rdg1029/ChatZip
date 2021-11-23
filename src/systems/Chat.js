import { userData } from './connection/UserData';

class Chat {
    constructor(peers) {
        this.component = document.getElementById('chat');
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
    showComponent() {
        this.component.style.display = 'unset';
    }
    showChat(msg) {
        const message = document.createElement('li');
        message.innerHTML = msg;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

export {Chat};
