class Chat {
    constructor() {
        this.form = document.getElementById('form');
        this.input = document.getElementById('input');
    }
    onSubmit(eventListener) {
        this.form.addEventListener('submit', eventListener);
    }

    showChat(msg) {
        const messages = document.getElementById('messages');
        const message = document.createElement('li');
        message.innerHTML = msg;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }
}
