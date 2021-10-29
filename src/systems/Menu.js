class Menu {
    constructor() {
        this.interface = document.getElementById('menu');
        this.btnClose = document.getElementById('btn-close');
        this.btnExit = document.getElementById('btn-exit');
        this.isReady = true;
    }
    open() {
        this.interface.style.display = 'unset';
    }
    close() {
        this.interface.style.display = 'none';
    }
}

export {Menu};
