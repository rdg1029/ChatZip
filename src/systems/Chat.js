import { user } from './User';

class Chat {
    constructor(peers) {
        this.isVisible = true;
        this.component = document.getElementById('chat');
        this.messages = document.getElementById('messages');
        this.form = document.getElementById('form');
        this.input = document.getElementById('input');

        this.form.addEventListener('submit', e => {
            const inputValue = this.input.value;
            e.preventDefault();
            if(inputValue === "") return;
            const msg = `${user.data.name} : ${inputValue}`;
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
    hideComponent() {
        this.component.style.display = 'none';
    }
    showChat(msg) {
        const message = document.createElement('li');
        message.innerHTML = msg;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

export {Chat};
