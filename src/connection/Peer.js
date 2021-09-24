class Peer {
    constructor(targetId, chatComponent, userModel) {
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.targetId = targetId;
        this.chatComponent = chatComponent;
        this.userModel = userModel;
        this.conn = new RTCPeerConnection(iceConfig);
    }
    setDataChannelOnMessage(peer) {
        peer.chat.onmessage = e => this.chatComponent.showChat(e.data);
        peer.movement.onmessage = e => {
            const speed = new Float32Array(e.data);
            const userSpeed = this.userModel.speed;
            userSpeed.set('posX', speed[0]);
            userSpeed.set('posY', speed[1]);
            userSpeed.set('posZ', speed[2]);
            userSpeed.set('rotX', speed[3]);
            userSpeed.set('rotY', speed[4]);
            userSpeed.set('rotZ', speed[5]);
        }
    }
    close() {
        this.userModel.dispose();
        this.conn.close();
    }
}

export {Peer};
