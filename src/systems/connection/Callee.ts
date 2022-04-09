import { UserData } from '../User';
import { Chat } from '../Chat';
import { UserModel } from '../world/components/user_model/UserModel';
import { socket } from './Socket';
import { user } from '../User';
import { Peer } from './Peer';

class Callee extends Peer {
    constructor(targetUserData: UserData, chatComponent: Chat, userModel: UserModel) {
        super(targetUserData, chatComponent, userModel);

        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (this.conn.iceGatheringState !== 'complete') return;
            console.log('ice gathering complete!');
            socket.emit('recv answer', this.conn.localDescription, user.data, targetUserData.id);
        }
    }
    createAnswer(offer: RTCSessionDescriptionInit) {
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
