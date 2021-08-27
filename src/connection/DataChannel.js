class DataChannel {
    constructor(peerConn, type, label) {
        switch(type) {
            case 'offer':
                this.channel = peerConn.createDataChannel(label);
                break;
            case 'answer':
                peerConn.ondatachannel = e => this.channel = e.channel;
                break;
        }
    }
    close() {
        this.channel.close();
    }
    send(data) {
        this.channel.send(data);
    }
    onMessage(onmessage) {
        this.channel.onmessage = onmessage;
    }
}

export {DataChannel};