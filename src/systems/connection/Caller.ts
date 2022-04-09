import { UserData } from '../User';
import { Chat } from '../Chat';
import { UserModel } from '../world/components/user_model/UserModel';
import { socket } from './Socket';
import { user } from '../User';
import { Peer } from './Peer';

class Caller extends Peer {
    constructor(targetUserData: UserData, chatComponent: Chat, userModel: UserModel) {
        super(targetUserData, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (this.conn.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            console.log(user.data);
            socket.emit('req answer', this.conn.localDescription, user.data, targetUserData.id);
        }
    }
    createOffer() {
        this.conn.createOffer()
            .then(offer => this.conn.setLocalDescription(offer));
    }
    receiveAnswer(answer: RTCSessionDescriptionInit) {
        this.conn.setRemoteDescription(answer);
    }
    close() {
        this.chat.close();
        this.movement.close();
        super.close();
    }
}

export {Caller};
