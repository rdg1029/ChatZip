import {socket} from './socket.js';

let group = {
    id: "",
    users: [],
    init: function() {
        this.id = Math.random().toString(36).substr(2,6);
    },
    addUser: function(id) {
        this.users.push(id);
        this.checkIsAlone();
    },
    removeUser: function(id) {
        this.users.splice(this.users.indexOf(id), 1);
        this.checkHost();
        this.checkIsAlone();
    },
    checkHost: function() {
        if(this.users[0] != socket.id) return;
        // console.log('You are host!');
        this.setHost();
    },
    setHost: function() {
        socket.on('req info', targetId => {
            // console.log(this.users);
            socket.emit('group info', targetId, this.users);
        });
    },
    checkIsAlone: function() {
        if(this.users.length == 1) {
            socket.emit('is alone', true);
            // console.log('user alone');
        }
        else {
            socket.emit('is alone', false);
            // console.log('user not alone');
        }
    }
}

export {group};