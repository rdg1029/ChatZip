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
}
