class Peer {
    constructor() {
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.conn = new RTCPeerConnection(iceConfig);
        this.conn.onicecandidate = () => {
            console.log('New ICE candidate!');
            console.log(JSON.stringify(this.conn.localDescription));
        }
        this.dataChannel = this.conn.createDataChannel("channel");
        this.conn.createOffer().then(offer => this.conn.setLocalDescription(offer));
    }
}

export {Peer};