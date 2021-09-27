import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class Controls extends PointerLockControls {
    constructor(camera, canvas, peers) {
        super(camera, canvas);
        this.camera = camera;
        this.peers = peers;
        this.isMouseMove = false;
        this.isKeyDown = false;
        this.key = new Map([
            ['w', false],
            ['a', false],
            ['s', false],
            ['d', false]
        ]);
        this.addEventListener('change', e => {
            this.isMouseMove = true;
        });
        document.addEventListener('keydown', e => {
            if (!this.key.has(e.key)) return;
            this.key.set(e.key, true);
            if (this.isKeyDown) return;
            this.isKeyDown = true;
        });
        document.addEventListener('keyup', e => {
            if (!this.key.has(e.key)) return;
            this.key.set(e.key, false);
            if (!this.isKeyDown) return;
            this.isKeyDown = false;
        });
        canvas.addEventListener('click', () => {
            this.lock();
        })
    }
    update(delta) {
        const speed = (10 * delta).toFixed(3);
        if (this.key.get('w')) {
            this.moveForward(speed);
        }
        if (this.key.get('a')) {
            this.moveRight(-speed);
        }
        if (this.key.get('s')) {
            this.moveForward(-speed);
        }
        if (this.key.get('d')) {
            this.moveRight(speed);
        }
    }
}

export {Controls};
