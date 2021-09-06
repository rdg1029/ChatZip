import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class Controls extends PointerLockControls {
    constructor(camera, canvas) {
        super(camera, canvas);
        camera.position.set(0, .5, 0);
        this.key = new Map([
            ['w', false],
            ['a', false],
            ['s', false],
            ['d', false]
        ]);
        document.addEventListener('keydown', e => {
            if (!this.key.has(e.key)) return;
            this.key.set(e.key, true);
        });
        document.addEventListener('keyup', e => {
            if (!this.key.has(e.key)) return;
            this.key.set(e.key, false);
        });
        canvas.addEventListener('click', () => {
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
