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
                <div id="menu">
                    <h1>메뉴</h1>
                    <p>&lt조작법&gt</p>
                    <p>
                        이동 : w, a, s, d<br>
                        화면 움직임 : 마우스<br>
                        채팅 : Enter<br>
                        메뉴 : Esc
                    </p>
                    <span>
                        <button id="btn-continue">메뉴 닫기</button>
                        <button id="btn-exit">방 나가기</button>
                    </span>
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
