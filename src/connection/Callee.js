import { socket } from '../connection/Socket.js';
import { Peer } from './Peer';

class Callee extends Peer {
    constructor(targetId, chatComponent, userModel) {
        super(targetId, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            socket.emit('recv answer', this.conn.localDescription, socket.id, targetId);
        }

        this.conn.ondatachannel = e => {
            switch(e.channel.label) {
                case 'chat':
                    this.chat = e.channel;
                    this.chat.onmessage = e => chatComponent.showChat(e.data);
                    break;
                case 'move':
                    this.movement = e.channel;
                    this.movement.onmessage = e => userModel.updateMovement(e.data);
                    break;
            }
        }
    }
    createAnswer(offer) {
        this.conn.setRemoteDescription(offer);
        this.conn.createAnswer()
            .then(answer => this.conn.setLocalDescription(answer));
    }
    close() {
        this.chat.close();
        this.movement.close();
        super.close();
    }
}

export {Callee};
