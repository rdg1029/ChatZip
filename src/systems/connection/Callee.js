import { socket } from './Socket';
import { userData } from './UserData';
import { Peer } from './Peer';

class Callee extends Peer {
    constructor(targetUserData, chatComponent, userModel) {
        super(targetUserData, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            socket.emit('recv answer', this.conn.localDescription, userData, targetUserData.id);
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
