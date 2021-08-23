class Group {
    constructor() {
        this.id = Math.random().toString(36).substr(2,6);
        this.users = [];
    }
    addUser(id) {
        this.users.push(id);
        this._setHost();
    }
    removeUser(id) {
        this.users.splice(this.users.indexOf(id), 1);
        this._setHost();
    }
    isHost(id) {
        return (this.host == id);
    }

    _setHost() {
        if (this.host === undefined || this.host === null || this.host == users[0]) return;
        this.host = users[0];
    }
}
