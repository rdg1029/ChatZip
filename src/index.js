import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility';
//import { setPage } from './page.js';
import { Main } from './pages/Main';
import { Room } from './pages/Room';

import { socket } from './connection/Socket';
import { Caller } from './connection/Caller';
import { Callee } from './connection/Callee';

import { Group } from './systems/Group';
import { Chat } from './systems/Chat';
import { World } from './systems/World';
import { Controls } from './systems/Controls';

import { UserModel } from './components/UserModel';

const compatibilityCheckResult = compatibilityCheck();
if (compatibilityCheckResult == 'done') {
    main();
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

function main() {
    const mainPage = new Main('main', './css/main.css');
    mainPage.setPage();
    socket.on('join group', groupId => {
        removeSocketListeners(
            'open',
            'group found',
            'group not found',
            'group info',
            'req answer'
        );
        mainPage.group.id = groupId;
        mainPage.group.addUser(socket.id);
        mainPage.removePage();
        room(mainPage.group, mainPage.offers);
    });
}

function room(group, offers) {
    const roomPage = new Room('room', './css/room.css');
    roomPage.setPage();

    const peers = new Map();
    const chat = new Chat(roomPage, peers);
    const world = new World(roomPage.canvas);
    const controls = new Controls(world.camera, roomPage.canvas, peers);

    offers.forEach((offer, id) => {
        const userModel = new UserModel()
        const peer = new Callee(id, chat, userModel);
        peer.createAnswer(offer);
        peers.set(id, peer);

        world.loop.updateList.push(userModel);
        world.scene.add(userModel.mesh);
    });

    checkIsHost(group);
    checkIsAlone(group);

    world.loop.updateList.push(controls);
    world.loop.tick.list.push(controls);
    world.start();
    chat.showChat('joined ' + group.id);

    /*Init socket listeners at room page*/
    socket.on('req offer', targetId => {
        console.log(targetId, 'requested offer');
        const userModel = new UserModel();
        const peer = new Caller(targetId, chat, userModel);
        peer.createOffer();
        peers.set(targetId, peer);
    });
    
    socket.on('recv answer', (answer, targetId) => {
        const peer = peers.get(targetId);
        peer.receiveAnswer(answer);
        world.loop.updateList.push(peer.userModel);
        world.scene.add(peer.userModel.mesh);
        // socket.emit('conn ready', targetId);
    });

    socket.on('user join', userId => {
        group.addUser(userId);
        chat.showChat(userId + " joined group");
        // addUserModel(world, userId, userModels);
    });
    
    socket.on('user quit', userId => {
        peers.get(userId).close();
        peers.delete(userId);
        group.removeUser(userId);
        chat.showChat(userId + " quit");

        checkIsHost(group);
        checkIsAlone(group);
    });
}

function checkIsHost(group) {
    if (!group.isHost(socket.id)) return;
    socket.on('req info', targetId => {
        console.log(targetId + ' requested info');
            socket.emit('group info', targetId, group.users);
    });
    console.log('You are host!');
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
