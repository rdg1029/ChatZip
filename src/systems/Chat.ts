import { user } from './User';
import { Peer } from './connection/Peer';

class Chat {
    public isVisible: boolean;
    public component: HTMLDivElement;
    public messages: HTMLUListElement;
    public form: HTMLFormElement;
    public input: HTMLInputElement;

    constructor(peers: Map<string, Peer>) {
        this.isVisible = true;
        this.component = document.getElementById('chat') as HTMLDivElement;
        this.messages = document.getElementById('messages') as HTMLUListElement;
        this.form = document.getElementById('form') as HTMLFormElement;
        this.input = document.getElementById('input') as HTMLInputElement;

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
    showChat(msg: string) {
        const message = document.createElement('li');
        message.innerHTML = msg;
        this.messages.appendChild(message);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

export {Chat};
