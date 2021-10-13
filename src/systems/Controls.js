import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const _prevMoveBuffer = new ArrayBuffer(28),
    _currentMoveBuffer = new ArrayBuffer(28),
    _prevMoveArray = new Float32Array(_prevMoveBuffer),
    _currentMoveArray = new Float32Array(_currentMoveBuffer);

function _isMove() {
    for (let i = 0; i < 7; i++) {
        if (_prevMoveArray[i] !== _currentMoveArray[i]) {
            return true;
        }
    }
    return false;
}

class Controls extends PointerLockControls {
    constructor(camera, canvas, peers) {
        super(camera, canvas);
        this.camera = camera;
        this.peers = peers;
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
        const pos = this.camera.getPosition();
        const qt = this.camera.getQuaternion();

        _prevMoveArray.set(_currentMoveArray);
        _currentMoveArray.set(pos, 0);
        _currentMoveArray.set(qt, 3);

        if (!_isMove()) return;
        
        // console.log(movementArray);

        const peers = Array.from(this.peers.values());
        for (let i = 0, j = peers.length; i < j; i++) {
            peers[i].sendMovement(_currentMoveBuffer);
        }
    }
}

export {Controls};
