import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility';
//import { setPage } from './page.js';
import { Main } from './pages/Main';
import { Room } from './pages/Room';

import { socket } from './connection/Socket';
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
    const mainPage = new Main('main', './css/main.css');
    mainPage.setPage();
    document.body.addEventListener('gotoroom', () => {
        mainPage.removePage();
        room(mainPage.group, mainPage.offers);
    });
}

function room(group, peers) {
    const roomPage = new Room('room', './css/room.css');
    roomPage.setPage();

    const chat = new Chat();
    const world = new World(roomPage.canvas);
    const controls = new Controls(world.camera, roomPage.canvas);
    const userModels = new Map();    

    checkIsHost(peers, group, world);
    checkIsAlone(group);

    peers.forEach((peer, id) => {
        peer.chat.onmessage = e => chat.showChat(e.data);
        peer.movement.onmessage = e => {
            const speed = new Float32Array(e.data);
            const userSpeed = userModels.get(id).speed;
            userSpeed.set('posX', speed[0]);
            userSpeed.set('posY', speed[1]);
            userSpeed.set('posZ', speed[2]);
            userSpeed.set('rotX', speed[3]);
            userSpeed.set('rotY', speed[4]);
            userSpeed.set('rotZ', speed[5]);
        }
        peer.tick.onmessage = e => {
            const speedBuffer = new ArrayBuffer(24);
            const speedArray = new Float32Array(speedBuffer);
            const posDelta = world.camera.getPositionDelta();
            const rotDelta = world.camera.getRotationDelta();
            speedArray[0] = posDelta.get('x');
            speedArray[1] = posDelta.get('y');
            speedArray[2] = posDelta.get('z');
            speedArray[3] = rotDelta.get('x');
            speedArray[4] = rotDelta.get('y');
            speedArray[5] = rotDelta.get('z');
            peers.forEach(p => {
                p.movement.send(speedBuffer);
            });
        }
        addUserModel(world, id, userModels);
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
    socket.on('req offer', targetId => {
        console.log(targetId, 'requested offer');
        const peer = new Caller(targetId);
        peer.onIceGatheringComplete(() => socket.emit('req answer', peer.conn.localDescription, socket.id, targetId));
        peer.chat.onmessage = e => chat.showChat(e.data);
        peer.createOffer();
        peers.set(targetId, peer);
    });
    
    socket.on('recv answer', (answer, targetId) => {
        peers.get(targetId).receiveAnswer(answer);
        socket.emit('conn ready', targetId);
    });

    socket.on('user join', userId => {
        group.addUser(userId);
        chat.showChat(userId + " joined group");
        addUserModel(world, userId, userModels);
    });
    
    socket.on('user quit', userId => {
        userModels.get(userId).dispose();
        peers.get(userId).close();
        userModels.delete(userId);
        peers.delete(userId);
        group.removeUser(userId);
        chat.showChat(userId + " quit");

        checkIsHost(peers, group, world);
        checkIsAlone(group);
    });
}

function checkIsHost(peers, group, world) {
    if (!group.isHost(socket.id)) return;
    world.tick.sendTick = () => {
        const emptyBuf = new ArrayBuffer(1);
        peers.forEach(peer => {
            peer.tick.send(emptyBuf);
        });
    };
    world.tick.isStandard = true;

    socket.on('req info', targetId => {
        console.log(targetId + ' requested info');
            socket.emit('group info', targetId, group.users);
    });

    console.log('You are host!');
}

function addUserModel(world, id, userModels) {
    const userModel = createUserModel();
    userModels.set(id, userModel);
    world.loop.updateList.push(userModel);
    world.scene.add(userModel);
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
