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
        this.userModel = userModel;
        this.conn = new RTCPeerConnection(iceConfig);
    }
    sendChat(data) {
        if (this.chat.readyState !== 'open') return;
        this.chat.send(data);
    }
    close() {
        this.userModel.dispose();
        this.conn.close();
    }
}

export {Peer};
