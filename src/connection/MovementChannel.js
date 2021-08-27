import { DataChannel } from "./DataChannel";

class MovementChannel extends DataChannel {
    constructor(peerConn, type, label) {
        super(peerConn, type, label);
        this.channel.binaryType = "arraybuffer";
    }
}

export {MovementChannel};