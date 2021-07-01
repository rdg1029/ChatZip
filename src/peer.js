class Peer {
    constructor() {
        this.iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
    }
    async createOffer() {
        //Set offer connection
        this.offerConn = new RTCPeerConnection(this.iceConfig);
        this.offerConn.onicecandidate = () => {
            console.log('New ICE candidate! (offer)');
            console.log(JSON.stringify(this.offerConn.localDescription));
        }
        this.dataChannel = this.offerConn.createDataChannel("channel");
        this.dataChannel.onopen = () => console.log('open');
        this.dataChannel.onclose = () => console.log('closed');

        this.offerConn.createOffer()
        .then(offer => this.offerConn.setLocalDescription(offer));
        return this.offerConn.localDescription;
    }
    async createAnswer(offer) {
        //Set answer connection
        this.answerConn = new RTCPeerConnection(this.iceConfig);
        this.answerConn.onicecandidate = () => {
            console.log('New ICE candidate! (answer)');
            console.log(JSON.stringify(this.answerConn.localDescription));
        }
        this.answerConn.ondatachannel = e => {
            e.channel.onopen = () => console.log('open');
            e.channel.onclose = () => console.log('closed');
        }

        this.answerConn.setRemoteDescription(offer).then(() => console.log('done'));
        this.answerConn.createAnswer()
        .then(answer => this.answerConn.setLocalDescription(answer));
        return this.answerConn.localDescription;
    }
    receiveAnswer(answer) {
        this.offerConn.setRemoteDescription(answer).then(() => console.log('done'));
    }
}

export {Peer};