import {UserModel} from './model.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

let peers = {};

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
                this.chatChannel = this.pc.createDataChannel('chat');
                this.movementChannel = this.pc.createDataChannel('move');
                this.initChatChannel(targetId);
                this.initMovementChannel();
                break;
            case 'answer':
                this.pc.ondatachannel = e => {
                    switch(e.channel.label) {
                        case 'chat':
                            this.chatChannel = e.channel;
                            this.initChatChannel(targetId);
                            break;
                        case 'move':
                            this.movementChannel = e.channel;
                            this.initMovementChannel();
                            break;
                    }
                }
                break;
        }
    }
    initChatChannel(targetId) {
        this.chatChannel.onopen = () => console.log('open with :', targetId);
        this.chatChannel.onmessage = e => showChat(e.data);
    }
    initMovementChannel() {
        this.movementChannel.binaryType = "arraybuffer";
        this.movementChannel.onmessage = e => {
            const peerMovement = new Float32Array(e.data);
            this.model.userMesh.position.set(peerMovement[0], peerMovement[1], peerMovement[2]);
            this.model.userMesh.rotation.set(peerMovement[3], peerMovement[4], peerMovement[5]);
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
        if(this.chatChannel.readyState != 'open') return;
        this.chatChannel.send(chat);
    }
    /*
    sendMovement(pos, rot) {
        if(this.movementChannel.readyState != 'open') return;
        const movementBuffer = new ArrayBuffer(24);
        const movementArray = new Float32Array(movementBuffer);
        movementArray[0] = pos.x;
        movementArray[1] = pos.y;
        movementArray[2] = pos.z;
        movementArray[3] = rot.x;
        movementArray[4] = rot.y;
        movementArray[5] = rot.z;
        this.movementChannel.send(movementBuffer);
    }
    */
    close() {
        this.chatChannel.close();
        this.movementChannel.close();
        this.pc.close();
        this.chatChannel = null;
        this.movementChannel = null;
        this.pc = null;
    }
}

export {Peer, peers};