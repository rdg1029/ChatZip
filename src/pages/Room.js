import {Page} from './Page.js';

import { socket } from '../systems/connection/Socket';
import { Caller } from '../systems/connection/Caller';
import { Callee } from '../systems/connection/Callee';

import { Chat } from '../systems/Chat';
import { Menu } from '../systems/Menu';
import { World } from '../systems/world/World';
import { Controls } from '../systems/Controls';

class Room extends Page {
    constructor(divID, css, group, offers) {
        super(divID, css);
        this.group = group;
        this.offers = offers;
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
                        <button id="btn-close">메뉴 닫기</button>
                        <button id="btn-exit">방 나가기</button>
                    </span>
                </div>
            </div>
        `;
    }
    setPage() {
        super.setPage(this.html);
        this.canvas = document.getElementById('c');

        const peers = new Map();
        const chat = new Chat(peers);
        const menu = new Menu();
        const world = new World(this.canvas);
        const controls = new Controls(world.camera, this.canvas, peers, chat.input, menu);

        this.offers.forEach((offer, id) => {
            const userModel = world.createUserModel();
            const peer = new Callee(id, chat, userModel);
            peer.createAnswer(offer);
            peers.set(id, peer);
    
            world.loop.updateList.push(userModel);
            world.scene.add(userModel);
        });

        checkIsHost(this.group);
        checkIsAlone(this.group);

        world.loop.updateList.push(controls);
        world.loop.tick.list.push(controls);
        world.start();
        controls.lock();
        chat.showChat('joined ' + this.group.id);

        /*Init socket listeners at room page*/
        socket.on('req offer', targetId => {
            console.log(targetId, 'requested offer');
            const userModel = world.createUserModel();
            const peer = new Caller(targetId, chat, userModel);
            peer.createOffer();
            peers.set(targetId, peer);
        });
    
        socket.on('recv answer', (answer, targetId) => {
            const peer = peers.get(targetId);
            peer.receiveAnswer(answer);
            world.loop.updateList.push(peer.userModel);
            world.scene.add(peer.userModel);
        });

        socket.on('user join', userId => {
            const peer = peers.get(userId);
            const posBuffer = new ArrayBuffer(12);
            const posArr = new Float32Array(posBuffer);

            posArr.set(world.camera.getPosition());
            peer.movement.onopen = () => {
                peer.sendMovement(posBuffer);
            }

            this.group.addUser(userId);
            chat.showChat(userId + " joined group");
            checkIsAlone(this.group);
        });
    
        socket.on('user quit', userId => {
            const peer = peers.get(userId);
            peer.close();
            world.scene.remove(peer.userModel);

            peers.delete(userId);
            this.group.removeUser(userId);
            chat.showChat(userId + " quit");

            checkIsHost(this.group);
            checkIsAlone(this.group);
        });
    }
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
    }
    else {
        socket.emit('is alone', false);
    }
}

export {Room};
