import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const movementBuffer = new ArrayBuffer(28);
const movementArray = new Float32Array(movementBuffer);

let _prevRot = [0, 0];

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
        this.addEventListener('change', e => this.isMouseMove = true);
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
    tick() {
        if (!this.isMouseMove && !this.isKeyDown) return;

        const pos = this.camera.getPosition();
        const qt = this.camera.getQuaternion();

        movementArray.set(pos, 0);
        movementArray.set(qt, 3);
        
        // console.log(movementArray);

        const peers = Array.from(this.peers.values());
        for (let i = 0, j = peers.length; i < j; i++) {
            peers[i].movement.send(movementBuffer);
        }

        if (qt[0] == _prevRot[0] && qt[1] == _prevRot[1]) {
            this.isMouseMove = false;
        }
        else {
            _prevRot = qt;
        }
    }
}

export {Controls};
