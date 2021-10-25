import { socket } from '../systems/connection/Socket';

import { Page } from './Page.js';
import { Group } from '../systems/Group';

class Main extends Page {
    constructor(divID, css) {
        super(divID, css);
        this.group = new Group();
        this.offers = new Map();
        this.html = `
            <div id="main">
                <h1>찻집</h1>
                <div id="signage">
                    <img src="./img/signage.svg">
                    <div class="contents" id="contents-main">
                        <p id="open-status">준비 중</p>
                        <button class="btn" id="create-group">방 생성</button>
                        <button class="btn" id="enter-group">방 입장</button>
                    </div>
                    <div class="contents" id="contents-enter">
                        <input id="type-group-id" type="text" />
                        <br>
                        <button class="btn" id="enter">입장</button>
                        <br>
                        <button class="btn" id="back">뒤로 가기</button>
                    </div>
                </div>
            </div>
        `;
    }
    setPage() {
        super.setPage(this.html);

        const mainSignage = document.getElementById('contents-main');
        const openStatus = document.getElementById('open-status');
        const createGroupButton = document.getElementById('create-group');
        const enterGroupButton = document.getElementById('enter-group');

        const enterSignage = document.getElementById('contents-enter');
        const typeGroupId = document.getElementById('type-group-id');
        const enterButton = document.getElementById('enter');
        const backButton = document.getElementById('back');

        createGroupButton.disabled = true;
        enterGroupButton.disabled = true;
        enterSignage.style.display = 'none';

        createGroupButton.onclick = () => {
            this.group.createNewId();
            socket.emit('create group', this.group.id);
        };
        enterGroupButton.onclick = () => {
            mainSignage.style.display = 'none';
            enterSignage.style.display = 'block';
        };
        enterButton.onclick = () => {
            if (typeGroupId.value == '') {
                window.alert("방 아이디를 입력해주세요");
                return;
            }
            socket.emit('find group', typeGroupId.value);
        };
        backButton.onclick = () => {
            enterSignage.style.display = 'none';
            mainSignage.style.display = 'block';
        };

        /*Init socket listeners at main page*/
        socket.on('open', () => {
            openStatus.innerHTML = "OPEN<br>(준비중)";
            createGroupButton.disabled = false;
            enterGroupButton.disabled = false;
        });

        socket.on('group found', groupId => {
            this.group.id = groupId;
            socket.emit('req info', groupId, socket.id);
        });
    
        socket.on('group not found', () => {
            window.alert('방을 찾을 수 없습니다');
        });

        socket.on('group info', users => {
            this.group.users = users;
            this.group.number = users.length;

            typeGroupId.remove();
            enterButton.remove();
            backButton.remove();

            const connMsg = document.createElement('p');
            connMsg.innerHTML = '연결 중...';
            enterSignage.appendChild(connMsg);

            socket.emit('req offer', this.group.id, socket.id);
        });

        socket.on('req answer', (offer, targetId) => {
            console.log(targetId, 'requested answer');
            this.offers.set(targetId, offer);
            if (this.group.number !== this.offers.size) return;
            socket.emit('req join', this.group.id);
        });
    }
}

export {Main};
