class DataChannel {
    constructor(peerConn, label) {
        this.channel = peerConn.createDataChannel(label);
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