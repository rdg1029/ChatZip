import { socket } from './Socket';
import { Peer } from './Peer';

class Caller extends Peer {
    constructor(userData, chatComponent, userModel) {
        super(userData, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            socket.emit('req answer', this.conn.localDescription, socket.id, userData);
        }
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
        super.close();
    }
}

export {Caller};
