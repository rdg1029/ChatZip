import {UserModel} from './model.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

let peers = {};

const movementBuffer = new ArrayBuffer(24);
const movementArray = new Float32Array(movementBuffer);

class Peer {
    constructor(type, targetId) {
        this.model = new UserModel();
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.type = type;
        this.pc = new RTCPeerConnection(iceConfig);
        this.pc.onicecandidate = () => {
            console.log('New ICE candidate!');
            console.log(this.pc.localDescription);
        }
        this.pc.onicegatheringstatechange = e => {
            if(e.target.iceGatheringState == 'complete') {
                console.log('collection of candidates is finished');
                switch(type) {
                    case 'offer':
                        socket.emit('req answer', this.pc.localDescription, socket.id, targetId);
                        break;
                    case 'answer':
                        socket.emit('recv answer', this.pc.localDescription, socket.id, targetId);
                        break;
                }
            }
        }
        this.dc = {};
        switch(type) {
            case 'offer':
                this.dc.chat = this.pc.createDataChannel('chat');
                this.dc.move = this.pc.createDataChannel('move');
                this.dc.move.binaryType = "arraybuffer";

                this.initChatChannel(targetId);
                this.initMovementChannel();
                break;
            case 'answer':
                this.pc.ondatachannel = e => {
                    switch(e.channel.label) {
                        case 'chat':
                            this.dc.chat = e.channel;
                            this.initChatChannel(targetId);
                            break;
                        case 'move':
                            this.dc.move = e.channel;
                            this.initMovementChannel();
                            break;
                    }
                }
                break;
        }
    }
    initChatChannel(targetId) {
        this.dc.chat.onopen = () => console.log('open with :', targetId);
        this.dc.chat.onmessage = e => showChat(e.data);
    }
    initMovementChannel() {
        this.dc.move.onmessage = e => {
            const movement = new Float32Array(e.data);
            // console.log('recv :', movementArray);
            this.model.userMesh.position.set(movement[0], movement[1], movement[2]);
            this.model.userMesh.rotation.set(movement[3], movement[4], movement[5]);
        };
    }
    createOffer() {
        if(this.type != 'offer') {
            console.error('You are not offer!');
            return;
        }
        this.pc.createOffer()
        .then(offer => this.pc.setLocalDescription(offer));
    }
    createAnswer(offer) {
        if(this.type != 'answer') {
            console.error('You are not answer!')
            return;
        }
        this.pc.setRemoteDescription(offer).then(() => console.log('done'));
        this.pc.createAnswer()
        .then(answer => this.pc.setLocalDescription(answer));
    }
    receiveAnswer(answer) {
        if(this.type != 'offer') {
            console.error('You are not offer!');
            return;
        }
        this.pc.setRemoteDescription(answer).then(() => console.log('done'));
    }
    sendChat(chat) {
        this.dc.chat.send(chat);
    }
    sendMovement(pos, rot) {
        movementArray[0] = pos.x;
        movementArray[1] = pos.y;
        movementArray[2] = pos.z;
        movementArray[3] = rot.x;
        movementArray[4] = rot.y;
        movementArray[5] = rot.z;
        this.dc.move.send(movementBuffer);
        // console.log('send :', movementArray);
    }
    close() {
        this.dc.chat.close();
        this.dc.move.close();
        this.pc.close();
        this.dc.chat = null;
        this.dc.move = null;
        this.pc = null;
    }
}

export {Peer, peers};