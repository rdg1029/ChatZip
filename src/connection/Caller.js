import { Peer } from './Peer';
import { ChatChannel } from './ChatChannel';
import { MovementChannel } from './MovementChannel';

class Caller extends Peer {
    constructor(targetId) {
        super(targetId);
        this.chat = new ChatChannel(this.conn, 'offer', 'chat');
        this.movement = new MovementChannel(this.conn, 'offer', 'move');
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
