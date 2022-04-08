class Group {
    public id: string;
    public number: number;
    public users: string[];
    public host: string;

    constructor() {
        this.number = 0;
        this.users = [];
    }
    private setHost() {
        if (this.number != 1 && this.host == this.users[0]) return;
        this.host = this.users[0];
    }
    public createNewId() {
        this.id = Math.random().toString(36).substr(2,6);
    }
    public addUser(id: string) {
        this.number = this.users.push(id);
        this.setHost();
    }
    public removeUser(id: string) {
        if (this.number == 0) {
            console.error('No users in this group!');
            return;
        }
        this.users.splice(this.users.indexOf(id), 1);
        if (--this.number == 0) return;
        this.setHost();
    }
    public isHost(id: string) {
        if (this.host === undefined || this.host === null) {
            console.error('Host is undefined or null');
            return;
        }
        return (this.host == id);
    }
}

export {Group};
