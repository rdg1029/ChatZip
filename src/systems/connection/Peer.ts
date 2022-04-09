import { UserData } from '../User';
import { Chat } from '../Chat';
import { UserModel } from '../world/components/user_model/UserModel';

class Peer {
    data: UserData;
    userModel: UserModel;
    conn: RTCPeerConnection;
    chat: RTCDataChannel;
    movement: RTCDataChannel;

    constructor(targetUserData: UserData, chatComponent: Chat, userModel: UserModel) {
        const iceConfig = {
            iceServers : [
                {
                    urls: 'stun:stun1.l.google.com:19302'
                }
            ]
        };
        this.data = targetUserData;
        this.userModel = userModel;
        this.conn = new RTCPeerConnection(iceConfig);

        this.chat = this.conn.createDataChannel('chat', {negotiated: true, id: 0});
        this.movement = this.conn.createDataChannel('move', {negotiated: true, id: 1});
        this.movement.binaryType = "arraybuffer";
        
        this.chat.onmessage = e => chatComponent.showChat(e.data);
        this.movement.onmessage = e => userModel.updateMovement(e.data);
    }
    sendChat(data: string) {
        if (this.chat.readyState !== 'open') return;
        this.chat.send(data);
    }
    sendMovement(data: Float32Array) {
        if (this.movement.readyState !== 'open') return;
        this.movement.send(data);
    }
    close() {
        this.userModel.dispose();
        this.conn.close();
    }
}

export {Peer};
