import { Peer } from './Peer';

class Caller extends Peer {
    constructor(targetId) {
        super(targetId);
        this.chat = this.conn.createDataChannel('chat');
        this.movement = this.conn.createDataChannel('move');
        this.tick = this.conn.createDataChannel('tick');

        this.movement.binaryType = "arraybuffer";
        this.tick.binaryType = "arraybuffer";
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
