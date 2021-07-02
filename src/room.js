class Room {
    constructor(host) {
        this.id = Math.random().toString(36).substr(2,6);
        this.host = host;
    }
    addUser(id) {
        this.users.push(id);
    }
}

export {Room};