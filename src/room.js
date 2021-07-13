import {socket} from './socket.js';

let room = {
    id: "",
    users: [],
    init: function() {
        this.id = Math.random().toString(36).substr(2,6);
    },
    addUser: function(id) {
        this.users.push(id);
    },
    removeUser: function(id) {
        this.users.splice(this.users.indexOf(id), 1);
        this.checkHost();
    },
    checkHost: function() {
        if(this.users[0] != socket.id) return;
        console.log('You are host!');
        this.setHost();
    },
    setHost: function() {
        socket.on('req info', targetId => {
            console.log(this.users);
            socket.emit('room info', targetId, this.users);
        });
    }
}

export {room};