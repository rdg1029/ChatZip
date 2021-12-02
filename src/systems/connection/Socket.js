const io = require('socket.io-client');
/*
Local Test : http://localhost:3000
Server Test : https://chatzip-signalling-server.herokuapp.com
*/
const socket = io('https://chatzip-signalling-server.herokuapp.com', { 
    transports: ["websocket"],
    closeOnBeforeunload: false
});

export {socket};
