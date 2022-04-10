class Menu {
    public interface: HTMLDivElement;
    public btnSpawn: HTMLButtonElement;
    public btnClose: HTMLButtonElement;
    public btnExit: HTMLButtonElement;
    public isReady: boolean;

    constructor() {
        this.interface = document.getElementById('menu') as HTMLDivElement;
        this.btnSpawn = document.getElementById('btn-spawn') as HTMLButtonElement;
        this.btnClose = document.getElementById('btn-close') as HTMLButtonElement;
        this.btnExit = document.getElementById('btn-exit') as HTMLButtonElement;
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