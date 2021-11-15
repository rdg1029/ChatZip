class Peer {
    constructor(userData, chatComponent, userModel) {
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.data = userData;
        this.userModel = userModel;
        this.conn = new RTCPeerConnection(iceConfig);

        this.chat = this.conn.createDataChannel('chat', {negotiated: true, id: 0});
        this.movement = this.conn.createDataChannel('move', {negotiated: true, id: 1});
        this.movement.binaryType = "arraybuffer";
        
        this.chat.onmessage = e => chatComponent.showChat(e.data);
        this.movement.onmessage = e => userModel.updateMovement(e.data);
    }
    sendChat(data) {
        if (this.chat.readyState !== 'open') return;
        this.chat.send(data);
    }
    sendMovement(data) {
        if (this.movement.readyState !== 'open') return;
        this.movement.send(data);
    }
    close() {
        this.userModel.dispose();
        this.conn.close();
    }
}

export {Peer};
