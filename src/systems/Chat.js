class Chat {
    constructor() {
        this.form = document.getElementById('form');
        this.input = document.getElementById('input');
        this.messages = document.getElementById('messages');
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
