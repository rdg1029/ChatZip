import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class Controls extends PointerLockControls {
    constructor(camera, canvas) {
        super(camera, canvas);
        this.key = new Map();
        document.addEventListener('keydown', e => {
            this.key.set(e.key, true);
        });
        document.addEventListener('keyup', e => {
            this.key.set(e.key, false);
        });
        canvas.addEventListener('click' () => {
            this.lock();
        })
    }
    tick() {
        if (this.key.get('w')) {
            this.moveForward(.1);
        }
        if (this.key.get('a')) {
            this.moveRight(-.1);
        }
        if (this.key.get('s')) {
            this.moveForward(-.1);
        }
        if (this.key.get('d')) {
            this.moveRight(.1);
        }
    }
}

export {Controls};
