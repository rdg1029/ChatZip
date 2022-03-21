import { socket } from './Socket';
import { user } from '../User';
import { Peer } from './Peer';

class Caller extends Peer {
    constructor(targetUserData, chatComponent, userModel) {
        super(targetUserData, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            console.log(user.info);
            socket.emit('req answer', this.conn.localDescription, user.info, targetUserData.id);
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
