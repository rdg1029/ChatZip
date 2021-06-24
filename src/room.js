class Room {
    constructor() {
        this.id = Math.random().toString(36).substr(2,6);
    }
}

export {Room};