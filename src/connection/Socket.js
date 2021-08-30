const io = require('socket.io-client');
/*
Local Test : http://localhost:3000
Server Test : https://chatzip-signalling-server.herokuapp.com
*/
const socket = io('https://chatzip-signalling-server.herokuapp.com');

function removeSocketListeners(...args) {
    for (let i = 0, j = args.length; i < j; i++) {
        socket.removeAllListeners(args[i]);
    }
}

export {socket, removeSocketListeners};
