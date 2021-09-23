import { socket } from "../connection/Socket";

class Chat {
    constructor(room, peers) {
        this.messages = room.chatMessages;
        this.form = room.chatForm;
        this.input = room.chatInput;

        this.form.addEventListener('submit', e => {
            const inputValue = this.input.value;
            e.preventDefault();
            if(inputValue === "") return;
            const msg = `${socket.id} : ${inputValue}`;
            peers.forEach(peer => {
                peer.chat.send(msg);
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
