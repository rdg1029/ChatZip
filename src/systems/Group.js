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
        if (this.users.length == 0) return;
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
        if (this.users.length != 1 && this.host == users[0]) return;
        this.host = users[0];
}
