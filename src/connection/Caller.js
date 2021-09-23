import { socket } from '../connection/Socket.js';
import { Peer } from './Peer';

class Caller extends Peer {
    constructor(targetId, chatComponent, userModel) {
        super(targetId, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            socket.emit('req answer', this.conn.localDescription, socket.id, targetId);
        }
        
        this.chat = this.conn.createDataChannel('chat');
        this.movement = this.conn.createDataChannel('move');
        this.movement.binaryType = "arraybuffer";

        super.setDataChannelOnMessage(this);
    }
    createOffer() {
        this.conn.createOffer()
            .then(offer => this.conn.setLocalDescription(offer));
    }
    receiveAnswer(answer) {
        this.conn.setRemoteDescription(answer);
    }
    close() {
        this.chat.close();
        this.movement.close();
        this.tick.close();
        super.close();
    }
}

export {Caller};
