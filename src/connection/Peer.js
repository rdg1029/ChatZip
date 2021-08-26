class Peer {
    constructor(targetId) {
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.targetId = targetId;
        this.conn = new RTCPeerConnection(iceConfig);
    }
}

export {Peer};