class Chat {
    constructor(room) {
        this.messages = room.chatMessages;
        this.form = room.chatForm;
        this.input = room.chatInput;
    }
    onSubmit(eventListener) {
        this.form.addEventListener('submit', eventListener);
    }

    showChat(msg) {
        const message = document.createElement('li');
        message.innerHTML = msg;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

export {Chat};
