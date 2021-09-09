import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility';
//import { setPage } from './page.js';
import { Main } from './pages/Main';
import { Room } from './pages/Room';

import { socket } from './connection/Socket';
import { Callee } from './connection/Callee';
import { Caller } from './connection/Caller';

import { Group } from './systems/Group';
import { Chat } from './systems/Chat';
import { World } from './systems/World';
import { Controls } from './systems/Controls';

import { createUserModel } from './components/UserModel';

const compatibilityCheckResult = compatibilityCheck();
if (compatibilityCheckResult == 'done') {
    main();
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

function main() {
    let connCount = 0;

    const group = new Group();
    const peers = new Map();
    const mainPage = new Main('main', './css/main.css');

    mainPage.setPage();
    mainPage.createGroupButton.onclick = () => {
        group.createNewId();
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
        const peer = new Callee(targetId);
        peer.onIceGatheringComplete(() => socket.emit('recv answer', peer.conn.localDescription, socket.id, targetId));
        peer.createAnswer(offer);
        peers.set(targetId, peer);
    });

    socket.on('conn ready', () => {
        if(group.number == ++connCount) {
            socket.emit('req join', group.id);
        }
    });

    socket.on('join group', () => {
        removeSocketListeners(
            'open',
            'group found',
            'group not found',
            'group info',
            'req answer',
            'conn ready',
            'join group'
        );
        group.addUser(socket.id);
        mainPage.removePage();

        room(group, peers);
    });
}

function room(group, peers) {
    const roomPage = new Room('room', './css/room.css');
    roomPage.setPage();

    const chat = new Chat();
    const world = new World(roomPage.canvas);
    const controls = new Controls(world.camera, roomPage.canvas);
    const userModels = new Map();

    checkIsAlone(group);

    peers.forEach((peer, id) => {
        const userModel = createUserModel();
        userModels.set(id, userModel);
        world.scene.add(userModel);
        peer.chat.onMessage(e => chat.showChat(e.data));
    });

    chat.onSubmit(e => {
        e.preventDefault();
        if(chat.input.value == "") return;
        const msg = socket.id + " : " + chat.input.value;
        peers.forEach(p => {
            p.chat.send(msg);
        })
        chat.showChat(msg);
        chat.input.value = "";
    });

    world.loop.updateList.push(controls);
    world.start();
    chat.showChat('joined ' + group.id);

    /*Init socket listeners at room page*/
    if (group.isHost(socket.id)) {
        socket.on('req info', targetId => {
            socket.emit('group info', targetId, group.users);
        });
    }

    socket.on('req offer', targetId => {
        const peer = new Caller(targetId);
        peer.onIceGatheringComplete(() => socket.emit('req answer', peer.conn.localDescription, socket.id, targetId));
        peer.chat.onMessage(e => chat.showChat(e.data));
        peer.createOffer();
        peers.set(targetId, peer);
    });
    
    socket.on('recv answer', (answer, targetId) => {
        peers.get(targetId).receiveAnswer(answer);
        socket.emit('conn ready', targetId);
    });

    socket.on('user join', userId => {});
    
    socket.on('user quit', userId => {});
}

function checkIsAlone(group) {
    if(group.number == 1) {
        socket.emit('is alone', true);
        // console.log('user alone');
    }
    else {
        socket.emit('is alone', false);
        // console.log('user not alone');
    }
}

function removeSocketListeners(...args) {
    for (let i = 0, j = args.length; i < j; i++) {
        socket.removeAllListeners(args[i]);
    }
}
