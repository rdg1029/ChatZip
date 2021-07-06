import { room } from './room.js';
import {socket} from './socket.js';

let peers = {};

class Peer {
    constructor() {
        this.iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
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
    createOffer(targetId) {
        //Set offer connection
        this.offerConn = new RTCPeerConnection(this.iceConfig);
        this.offerConn.onicecandidate = () => {
            console.log('New ICE candidate! (offer)');
            console.log(JSON.stringify(this.offerConn.localDescription));
        }
        this.setOnIceGatheringStateChange('offer', this.offerConn, targetId);
        this.dataChannel = this.offerConn.createDataChannel("channel");
        this.dataChannel.onopen = () => {
            console.log('open');
        }
        this.dataChannel.onclose = () => {
            peers[targetId] = null;
            delete peers[targetId];
            room.removeUser(targetId);
            console.log('closed');
            console.log(room.users);
        }

        this.offerConn.createOffer()
        .then(offer => this.offerConn.setLocalDescription(offer));
    }
    createAnswer(offer, targetId) {
        //Set answer connection
        this.answerConn = new RTCPeerConnection(this.iceConfig);
        this.answerConn.onicecandidate = () => {
            console.log('New ICE candidate! (answer)');
            console.log(JSON.stringify(this.answerConn.localDescription));
        }
        this.setOnIceGatheringStateChange('answer', this.answerConn, targetId);
        this.answerConn.ondatachannel = e => {
            e.channel.onopen = () => {
                console.log('open');
            }
            e.channel.onclose = () => {
                peers[targetId] = null;
                delete peers[targetId];
                room.removeUser(targetId);
                console.log('closed');
                console.log(room.users);
            }
        }

        this.answerConn.setRemoteDescription(offer).then(() => console.log('done'));
        this.answerConn.createAnswer()
        .then(answer => this.answerConn.setLocalDescription(answer));
    }
    receiveAnswer(answer) {
        this.offerConn.setRemoteDescription(answer).then(() => console.log('done'));
    }
}

export {Peer, peers};