class Group {
    constructor() {
        this.id = Math.random().toString(36).substr(2,6);
        this.number = 0;
        this.users = [];
    }
    addUser(id) {
        this.users.push(id);
        ++this.number;
        this._setHost();
    }
    removeUser(id) {
        if (this.number == 0) {
            console.error('No users in this group!');
            return;
        }
        this.users.splice(this.users.indexOf(id), 1);
        if (--this.number == 0) return;
        this._setHost();
    }
    isHost(id) {
        if (this.host === undefined || this.host === null) {
            console.error('Host is undefined or null');
            return;
        }
        return (this.host == id);
    }

    _setHost() {
        if (this.number != 1 && this.host == users[0]) return;
        this.host = users[0];
    }
}
