import { socket } from '../systems/connection/Socket';
import { Group } from '../systems/Group';
import { user, UserData } from '../systems/User';
import { Page } from './Page';

type Offers = Map<UserData, object>;

class Main extends Page {
    private group: Group;
    private offers: Offers;
    public html: string;

    constructor(divID: string, css: string, group: Group, offers: Offers) {
        super(divID, css);
        this.group = group;
        this.offers = offers;
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
                        <div id="type-info">
                            <input id="type-group-id" type="text" placeholder="방 ID 입력"/>
                            <br>
                            <input id="type-name" type="text" placeholder="이름 입력"/>
                        </div>
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

        const mainSignage = document.getElementById('contents-main') as HTMLDivElement;
        const openStatus = document.getElementById('open-status') as HTMLParagraphElement;
        const createGroupButton = document.getElementById('create-group') as HTMLButtonElement;
        const enterGroupButton = document.getElementById('enter-group') as HTMLButtonElement;

        const enterSignage = document.getElementById('contents-enter') as HTMLDivElement;
        const typeGroupId = document.getElementById('type-group-id') as HTMLInputElement;
        const typeName = document.getElementById('type-name') as HTMLInputElement;
        const enterButton = document.getElementById('enter') as HTMLButtonElement;
        const backButton = document.getElementById('back')as HTMLButtonElement;

        createGroupButton.disabled = true;
        enterGroupButton.disabled = true;
        enterSignage.style.display = 'none';
        enterButton.disabled = true;

        const scope = this;
        let isEnterGroup = false;
        function onChangeInputValue() {
            if (isEnterGroup) {
                if (typeGroupId.value === '' || typeName.value === '') {
                    enterButton.disabled = true;
                }
                else {
                    enterButton.disabled = false;
                }
            }
            else {
                if (typeName.value === '') {
                    enterButton.disabled = true;
                }
                else {
                    enterButton.disabled = false;
                }
            }
        }
        function createGroup() {
            user.data.name = typeName.value;
            scope.group.createNewId();
            socket.emit('create group', scope.group.id);
        }
        function enterGroup() {
            user.data.name = typeName.value;
            socket.emit('find group', typeGroupId.value);
        }

        typeGroupId.onchange = onChangeInputValue;
        typeName.onchange = onChangeInputValue;
        createGroupButton.onclick = () => {
            isEnterGroup = false;
            mainSignage.style.display = 'none';
            enterSignage.style.display = 'block';
            typeGroupId.style.display = 'none';

            enterButton.onclick = createGroup;
        };
        enterGroupButton.onclick = () => {
            isEnterGroup = true;
            mainSignage.style.display = 'none';
            enterSignage.style.display = 'block';
            typeGroupId.style.display = 'block';

            enterButton.onclick = enterGroup;
        };
        backButton.onclick = () => {
            enterSignage.style.display = 'none';
            mainSignage.style.display = 'block';
        };

        /*Init socket listeners at main page*/
        socket.on('open', () => {
            user.data.id = socket.id;
            openStatus.innerHTML = "OPEN<br>(준비중)";
            createGroupButton.disabled = false;
            enterGroupButton.disabled = false;
        });

        socket.on('group found', (groupId: string) => {
            this.group.id = groupId;
            socket.emit('req info', groupId, socket.id);
        });
    
        socket.on('group not found', () => {
            window.alert('방을 찾을 수 없습니다');
        });

        socket.on('group info', (users: string[]) => {
            this.group.users = users;
            this.group.number = users.length;

            typeGroupId.remove();
            typeName.remove();
            enterButton.remove();
            backButton.remove();

            const connMsg = document.createElement('p');
            connMsg.innerHTML = '연결 중...';
            enterSignage.appendChild(connMsg);

            socket.emit('req offer', this.group.id, user.data);
        });

        socket.on('req answer', (offer: object, targetUserData: UserData) => {
            console.log(targetUserData.id, 'requested answer');
            this.offers.set(targetUserData, offer);
            if (this.group.number !== this.offers.size) return;
            socket.emit('req join', this.group.id);
        });
    }
}

export {Main};
