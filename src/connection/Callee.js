import { Peer } from './Peer';

class Callee extends Peer {
    constructor(targetId) {
        super(targetId);
        this.conn.ondatachannel = e => {
            switch(e.channel.label) {
                case 'chat':
                    this.chat = e.channel;
                    break;
                case 'move':
                    this.movement = e.channel;
                    break;
                case 'tick':
                    this.tick = e.channel;
            }
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
        this.tick.close();
        super.close();
    }
}

export {Callee};
