import {Page} from './Page';

import { socket } from '../systems/connection/Socket';
import { Caller } from '../systems/connection/Caller';
import { Callee } from '../systems/connection/Callee';

import { Chat } from '../systems/Chat';
import { Menu } from '../systems/Menu';
import { World } from '../systems/world/World';
import { Controls } from '../systems/controls/Controls';
import { Collider } from '../systems/world/Collider';
import { Group } from '../systems/Group';

interface UserData {
    id: string;
    name: string;
}
type Offers = Map<UserData, object>;

class Room extends Page {
    private group: Group;
    private offers : Offers;
    public html: string;
    public canvas: HTMLCanvasElement;
    public state: HTMLDivElement;

    constructor(divID: string, css: string, group: Group, offers: Offers) {
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
                <div id="state"></div>
                <div id="menu">
                    <h1>메뉴</h1>
                    <p><h3>&lt조작법&gt</h3></p>
                    <p>
                        --- 이동 ---<br>
                        앞 : W<br>
                        뒤 : S<br>
                        왼쪽 : A<br>
                        오른쪽 : D<br>
                    </p>
                    <p>
                        --- 화면 움직임 ---<br>
                        마우스
                    </p>
                    <p>
                        --- 채팅 ---<br>
                        입력 : Enter<br>
                        보이기/숨기기 : C
                    </p>
                    <p>
                        --- 메뉴 ---<br>
                        ESC
                    </p>
                    <span>
                        <button id="btn-close">메뉴 닫기</button>
                        <button id="btn-exit">방 나가기</button>
                    </span>
                </div>
            </div>
        `;
        window.addEventListener('beforeunload', e => {
            e.preventDefault();
            e.returnValue = '';
        });
    }
    setPage() {
        super.setPage(this.html);
        this.canvas = document.getElementById('c') as HTMLCanvasElement;
        this.state = document.getElementById('state') as HTMLDivElement;
        /*
        this.state.update = () => {
            const userState = user.state;
            this.state.innerText = `
            pos:${userState.pos}
            velocity:${userState.velocity}
            onGround:${userState.onGround}
            gravAccel:${userState.gravAccel}
            `;
        }
        */
        const peers = new Map();
        const chat = new Chat(peers);
        const menu = new Menu();
        const world = new World(this.canvas);
        const worldUpdates = world.loop.updateList;

        const controls = new Controls(world.camera, this.canvas, peers, chat, menu);
        const collider = new Collider(world.map, controls);
        // world.scene.add(collider.helper);
        
        worldUpdates.push(collider);
        world.loop.tick.list.push(controls);

        // Test file
        const file = new XMLHttpRequest();
        file.open('GET', './assets/TEST.zip', true);
        file.onreadystatechange = () => {
            if (file.readyState === 4) {
                if (file.status === 200 || file.status === 0) {
                    world.map.load(file.response);
                }
            }
        }
        file.responseType = 'arraybuffer';
        file.send(null);

        this.offers.forEach((offer, userData) => {
            const userModel = world.createUserModel(userData.name);
            const peer = new Callee(userData, chat, userModel);
            peer.createAnswer(offer);
            peers.set(userData.id, peer);
    
            worldUpdates.push(userModel);
            world.scene.add(userModel);
        });

        checkIsHost(this.group);
        checkIsAlone(this.group);

        world.start();
        controls.lock();
        chat.showChat('joined ' + this.group.id);

        /*Init socket listeners at room page*/
        socket.on('req offer', (userData: UserData) => {
            console.log(userData.id, 'requested offer');
            const userModel = world.createUserModel(userData.name);
            const peer = new Caller(userData, chat, userModel);
            peer.createOffer();
            peers.set(userData.id, peer);
        });
    
        socket.on('recv answer', (answer: object, userData: UserData) => {
            const peer = peers.get(userData.id);
            peer.receiveAnswer(answer);
            worldUpdates.push(peer.userModel);
            world.scene.add(peer.userModel);
        });

        socket.on('user join', (userId: string) => {
            const peer = peers.get(userId);
            const posBuffer = new ArrayBuffer(12);
            const posArr = new Float32Array(posBuffer);

            posArr.set(world.camera.getPosition());
            peer.movement.onopen = () => {
                peer.sendMovement(posBuffer);
            }

            this.group.addUser(userId);
            chat.showChat(peer.data.name + " joined group");
            checkIsAlone(this.group);
        });
    
        socket.on('user quit', (userId: string) => {
            const peer = peers.get(userId);
            peer.close();
            world.scene.remove(peer.userModel);

            peers.delete(userId);
            this.group.removeUser(userId);
            chat.showChat(peer.data.name + " quit");

            checkIsHost(this.group);
            checkIsAlone(this.group);
        });
    }
}

function checkIsHost(group: Group) {
    if (!group.isHost(socket.id)) return;
    socket.on('req info', (targetId: string) => {
        console.log(targetId + ' requested info');
        socket.emit('group info', targetId, group.users);
    });
    console.log('You are host!');
}

function checkIsAlone(group: Group) {
    if(group.number == 1) {
        socket.emit('is alone', true);
    }
    else {
        socket.emit('is alone', false);
    }
}

export {Room};
