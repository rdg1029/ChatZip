import { DataChannel } from "./DataChannel";

class ChatChannel extends DataChannel {
    constructor(peerConn, type, label) {
        super(peerConn, type, label);
    }
}

export {ChatChannel};