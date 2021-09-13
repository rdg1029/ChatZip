class Tick {
    constructor() {
        this.list = [];
        this.isStandard = false;
    }
    update() {
        for (let i = 0, j = this.list.length; i < j; i++) {
            this.list[i].tick();
        }
    }
}

export {Tick};