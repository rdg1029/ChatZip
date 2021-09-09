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
    onIceGatheringComplete(callBack) {
        this.conn.onicegatheringstatechange = e => {
            console.log('ice gathering...');
            if (e.target.iceGatheringState == 'complete') {
                console.log('ice gathering complete!');
                callBack();
            }
        }
    }
    close() {
        this.conn.close();
    }
}

export {Peer};