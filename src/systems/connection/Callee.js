import { socket } from './Socket';
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
