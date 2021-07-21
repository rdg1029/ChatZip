import {setPage} from './page.js';
import {Peer, peers} from './peer.js';
import {group} from './group.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

let main, signage, mainSignage, enterSignage, typeGroupId, enterButton, createGroup, enterGroup, backButton;
let readyCount = 0;

function initMain() {
    main = document.getElementById('main');
    signage = document.getElementById('signage');

    mainSignage = document.getElementById('contents-main');
    createGroup = document.getElementById('create-group');
    enterGroup = document.getElementById('enter-group');

    enterSignage = document.getElementById('contents-enter');
    typeGroupId = document.getElementById('type-group-id');
    enterButton = document.getElementById('enter');
    backButton = document.getElementById('back');
    enterSignage.style.display = 'none';

    createGroup.onclick = () => {
        group.init();
        group.setHost();
        socket.emit('create group', group.id);
    }
    enterGroup.onclick = () => {
        mainSignage.style.display = 'none';
        enterSignage.style.display = 'block';
        enterButton.onclick = () => {
            if(typeGroupId.value == "") {
                window.alert("방 아이디를 입력해주세요");
                return;
            }
            socket.emit('find group', typeGroupId.value);
        }
        backButton.onclick = () => {
            enterSignage.style.display = 'none';
            mainSignage.style.display = 'block';
        }
    }
    setSocketListener();
}

function setSocketListener() {
    socket.on('open', () => {
        //document.getElementById('status').innerHTML = "OPEN";
        console.log('connected!');
    });

    socket.on('group found', groupId => {
        group.id = groupId;
        typeGroupId.remove();
        enterButton.remove();
        backButton.remove();
        const connMsg = document.createElement('p');
        connMsg.innerHTML = '연결 중...';
        enterSignage.appendChild(connMsg);
        socket.emit('req info', groupId, socket.id);
    });
    
    socket.on('group not found', () => {
        window.alert('방을 찾을 수 없습니다');
    });

    socket.on('group info', users => {
        group.users = users;
        console.log(group.users);
        socket.emit('req offer', group.id, socket.id);
    });

    socket.on('req answer', (offer, targetId) => {
        peers[targetId] = new Peer('answer', targetId);
        peers[targetId].createAnswer(offer);
        //group.addUser(targetId);
    });

    socket.on('conn ready', () => {
        ++readyCount;
        console.log('ready count :', readyCount);
        console.log('group users :', group.users.length);
        if(group.users.length == readyCount) {
            console.log('req join!');
            socket.emit('req join', group.id);
        }
    });

    socket.on('join group', groupId => {
        removeSocketListener();
        group.id = groupId;
        group.addUser(socket.id);
        console.log(group.users);
        setPage('chat');
        showChat('join group : ' + groupId);
        /*
        document.body.style.backgroundColor = "#ffffff";
        main.remove();
        const groupName = document.createElement('h1');
        groupName.innerHTML = 'Group : ' + group.id;
        document.body.appendChild(groupName);
        */
    });
}

function removeSocketListener() {
    socket.removeAllListeners('open');
    socket.removeAllListeners('group found');
    socket.removeAllListeners('group not found');
    socket.removeAllListeners('group info');
    socket.removeAllListeners('req answer');
    socket.removeAllListeners('conn ready');
}

export {initMain};