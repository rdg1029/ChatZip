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
    }
}

export {room};