import { room } from './room.js';
import {socket} from './socket.js';

let peers = {};

class Peer {
    constructor(type, targetId) {
        this.iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.type = type;
        this.pc = new RTCPeerConnection(this.iceConfig);
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
        switch(type) {
            case 'offer':
                this.dataChannel = this.pc.createDataChannel('dCh');
                this.dataChannel.onopen = () => {
                    console.log('open with :', targetId);
                }
                this.dataChannel.onclose = () => {
                    peers[targetId] = null;
                    delete peers[targetId];
                    room.removeUser(targetId);
                    console.log('closed with :', targetId);
                    console.log(room.users);
                }
                break;
            case 'answer':
                this.pc.ondatachannel = e => {
                    e.channel.onopen = () => {
                        console.log('open with :', targetId);
                    }
                    e.channel.onclose = () => {
                        peers[targetId] = null;
                        delete peers[targetId];
                        room.removeUser(targetId);
                        console.log('closed with :', targetId);
                        console.log(room.users);
                    }
                }
                break;
        }
    }
    setOnIceGatheringStateChange(type, pc, targetId) {
        pc.onicegatheringstatechange = e => {
            if(e.target.iceGatheringState == 'complete') {
                console.log('collection of candidates is finished');
                switch(type) {
                    case 'offer':
                        socket.emit('req answer', this.offerConn.localDescription, socket.id, targetId);
                        break;
                    case 'answer':
                        socket.emit('recv answer', this.answerConn.localDescription, socket.id, targetId);
                        break;
                }
            }
        }
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
}

export {Peer, peers};