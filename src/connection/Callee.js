import { Peer } from './Peer';
import { ChatChannel } from './ChatChannel';
import { MovementChannel } from './MovementChannel';

class Callee extends Peer {
    constructor(targetId) {
        super(targetId);
        this.chat = new ChatChannel(this.conn, 'answer', 'chat');
        this.movement = new MovementChannel(this.conn, 'answer', 'move');
    }
    createAnswer(offer) {
        this.conn.setRemoteDescription(offer);
        this.conn.createAnswer()
            .then(answer => this.conn.setLocalDescription(answer));
    }
}

export {Callee};
