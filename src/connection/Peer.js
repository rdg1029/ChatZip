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
        peer.movement.onmessage = e => this.userModel.updateMovement(e.data);
    }
    close() {
        this.userModel.dispose();
        this.conn.close();
    }
}

export {Peer};
