import {UserModel} from './model.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

let peers = {};

const posBuffer = new ArrayBuffer(12);
const posArray = new Float32Array(posBuffer);

class Peer {
    constructor(type, targetId) {
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
                this.dc.pos = this.pc.createDataChannel('pos');
                this.dc.pos.binaryType = "arraybuffer";

                this.#initChatChannel(targetId);
                this.#initPosChannel();
                break;
            case 'answer':
                this.pc.ondatachannel = e => {
                    switch(e.channel.label) {
                        case 'chat':
                            this.dc.chat = e.channel;
                            this.#initChatChannel(targetId);
                            break;
                        case 'pos':
                            this.dc.pos = e.channel;
                            this.#initPosChannel();
                            break;
                    }
                }
                break;
        }
        this.model = new UserModel();
    }
    #initChatChannel(targetId) {
        this.dc.chat.onopen = () => console.log('open with :', targetId);
        this.dc.chat.onmessage = e => showChat(e.data);
    }
    #initPosChannel() {
        this.dc.pos.onmessage = e => {
            const pos = new Float32Array(e.data);
            // console.log('recv :', posArray);
            this.model.userMesh.position.set(pos[0], pos[1], pos[2]);
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
    sendPos(pos) {
        posArray[0] = pos.x;
        posArray[1] = pos.y;
        posArray[2] = pos.z;
        this.dc.pos.send(posBuffer);
        // console.log('send :', posArray);
    }
    close() {
        this.dc.chat.close();
        this.pc.close();
        this.dc.chat = null;
        this.pc = null;
    }
}

export {Peer, peers};