class Room {
    constructor(host) {
        this.id = Math.random().toString(36).substr(2,6);
        this.users = [];
        this.users.push(host);
    }
    addUser(id) {
        this.users.push(id);
    }
    removeUser(id) {
        this.users.splice(this.users.indexOf(id), 1);
    }
}

export {Room};