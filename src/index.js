import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility';
//import { setPage } from './page.js';
import { Main } from './pages/Main';
import { Room } from './pages/Room';

import { socket } from './systems/connection/Socket';
import { Group } from './systems/Group';

const group = new Group();
const offers = new Map();

const compatibilityCheckResult = compatibilityCheck();
if (compatibilityCheckResult == 'done') {
    main();
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

function main() {
    const main = new Main('main', './css/main.css', group, offers);
    main.setPage();
    socket.on('join group', groupId => {
        removeSocketListeners(
            'open',
            'group found',
            'group not found',
            'group info',
            'req answer',
            'join group'
        );
        group.id = groupId;
        group.addUser(socket.id);
        main.removePage();
        room();
    });
}

function room() {
    const room = new Room('room', './css/room.css', group, offers);
    room.setPage();
}

function removeSocketListeners(...args) {
    for (let i = 0, j = args.length; i < j; i++) {
        socket.removeAllListeners(args[i]);
    }
}
