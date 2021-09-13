class Tick {
    constructor() {
        list = [];
    }
    update() {
        for (let i = 0, j = this.list.length; i < j; i++) {
            this.list[i].tick();
        }
    }
}

export {Tick};