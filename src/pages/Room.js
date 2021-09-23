import { socket } from '../connection/Socket.js';

import {Page} from './Page.js';

class Room extends Page {
    constructor(divID, css) {
        super(divID, css);
        this.html = `
            <div id="room">
                <canvas id="c"></canvas>
                <div id="chat">
                    <ul id="messages"></ul>
                    <form id="form">
                        <input id="input" />
                    </form>
                </div>
            </div>
        `;
    }
    setPage() {
        super.setPage(this.html);
        this.canvas = document.getElementById('c');
        
        this.chatMessages = document.getElementById('messages');
        this.chatForm = document.getElementById('form');
        this.chatInput = document.getElementById('input');
    }
}

export {Room};
