import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility';
//import { setPage } from './page.js';
import { Main } from './pages/Main';

import { socket } from './connection/Socket';

import { Group } from './systems/Group';

const compatibilityCheckResult = compatibilityCheck();
if (compatibilityCheckResult == 'done') {
    main();
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

function main() {
    let group;
    const mainPage = new Main('main', '../dist/css/main.css');

    mainPage.setPage();
    mainPage.createGroupButton.onclick = () => {
        group = new Group();
        group.addUser(socket.id);
        socket.emit('create group', group.id);
    };
    mainPage.enterGroupButton.onclick = () => {
        mainPage.mainSignage.style.display = 'none';
        mainPage.enterSignage.style.display = 'block';
    };
    mainPage.enterButton.onclick = () => {
        if (mainPage.typeGroupId.value == '') {
            window.alert("방 아이디를 입력해주세요");
            return;
        }
        socket.emit('find group', mainPage.typeGroupId.value);
    };
    mainPage.backButton.onclick = () => {
        mainPage.enterSignage.style.display = 'none';
        mainPage.mainSignage.style.display = 'block';
    };

    /*Init socket listeners at main page*/
    socket.on('open', () => {
        mainPage.openStatus.innerHTML = "OPEN<br>(준비중)";
        mainPage.createGroupButton.disabled = false;
        mainPage.enterGroupButton.disabled = false;
    });

    socket.on('group found', groupId => {
        group.id = groupId;

        mainPage.typeGroupId.remove();
        mainPage.enterButton.remove();
        mainPage.backButton.remove();

        const connMsg = document.createElement('p');
        connMsg.innerHTML = '연결 중...';
        mainPage.enterSignage.appendChild(connMsg);

        socket.emit('req info', groupId, socket.id);
    });
    
    socket.on('group not found', () => {
        window.alert('방을 찾을 수 없습니다');
    });

    socket.on('group info', users => {
        group.users = users;
        socket.emit('req offer', group.id, socket.id);
    });

    socket.on('req answer', (offer, targetId) => {
        //peers[targetId] = new Peer('answer', targetId);
        //peers[targetId].createAnswer(offer); 
    });

    socket.on('conn ready', () => {
        /*
        ++readyCount;
        if(group.users.length == readyCount) {
            socket.emit('req join', group.id);
        }
        */
    });

    socket.on('join group', groupId => {
        /*
        removeSocketListener();
        group.id = groupId;
        group.addUser(socket.id);
        setPage('room');
        showChat('join group : ' + groupId);
        */
    });
}
