import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class Controls extends PointerLockControls {
    constructor(camera, canvas) {
        super(camera, canvas);
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
    tick(delta) {
        if (this.key.get('w')) {
            this.moveForward(10 * delta);
        }
        if (this.key.get('a')) {
            this.moveRight(-10 * delta);
        }
        if (this.key.get('s')) {
            this.moveForward(-10 * delta);
        }
        if (this.key.get('d')) {
            this.moveRight(10 * delta);
        }
    }
}

export {Controls};
