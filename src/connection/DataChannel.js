class DataChannel {
    constructor(peerConn, type, label) {
        this.conn = peerConn;
        this.type = type;
        this.label = label;
    }
    createChannel() {
        this.channel = this.conn.createDataChannel(this.label);
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