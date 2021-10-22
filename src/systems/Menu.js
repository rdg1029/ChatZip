class Menu {
    constructor(room) {
        this.interface = room.menu;
        this.btnClose = room.menuBtnClose;
        this.btnExit = room.menuBtnExit;
        this.isOpen = false;
    }
    open() {
        this.interface.style.display = 'unset';
    }
    close() {
        this.interface.style.display = 'none';
    }
}

export {Menu};