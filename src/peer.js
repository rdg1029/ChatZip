import { room } from './room.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

let peers = {};

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
        switch(type) {
            case 'offer':
                this.pc.dataChannel = this.pc.createDataChannel('dCh');
                this.pc.dataChannel.onopen = () => {
                    console.log('open with :', targetId);
                }
                this.pc.dataChannel.onclose = () => {
                    this.pc.close();
                    peers[targetId] = null;
                    delete peers[targetId];
                    room.removeUser(targetId);
                    showChat(targetId + " quit");
                    console.log('closed with :', targetId);
                    console.log(room.users);
                }
                this.pc.dataChannel.onmessage = e => {
                    //console.log(e.data);
                    showChat(e.data);
                }
                break;
            case 'answer':
                this.pc.ondatachannel = e => {
                    this.pc.dataChannel = e.channel;
                    this.pc.dataChannel.onopen = () => {
                        console.log('open with :', targetId);
                    }
                    this.pc.dataChannel.onclose = () => {
                        this.pc.close();
                        peers[targetId] = null;
                        delete peers[targetId];
                        room.removeUser(targetId);
                        showChat(targetId + " quit");
                        console.log('closed with :', targetId);
                        console.log(room.users);
                    }
                    this.pc.dataChannel.onmessage = e => {
                        //console.log(e.data);
                        showChat(e.data);
                    }
                }
                break;
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
    sendData(data) {
        this.pc.dataChannel.send(data);
    }
}

export {Peer, peers};