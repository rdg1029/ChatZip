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
    constructor(camera, canvas, peers, chatInput) {
        super(camera, canvas);
        this.camera = camera;
        this.peers = peers;
        this.chatInput = chatInput;
        this.key = new Map([
            ['w', false],
            ['a', false],
            ['s', false],
            ['d', false]
        ]);

        const scope = this;
        function _eventMoveKeyDown(e) {
            if (e.key === 'Enter') {
                scope.unlock();
                scope.chatInput.focus();
                return;
            }
            if (!scope.key.has(e.key)) return;
            if (scope.key.get(e.key)) return;
            scope.key.set(e.key, true);
        }

        function _eventMoveKeyUp(e) {
            if (!this.key.has(e.key)) return;
            if (!this.key.get(e.key)) return;
            this.key.set(e.key, false);
        }

        this.addEventListener('lock', e => {
            document.addEventListener('keydown', _eventMoveKeyDown);
            document.addEventListener('keyup', _eventMoveKeyUp);
        });
        this.addEventListener('unlock', e => {
            document.removeEventListener('keydown', _eventMoveKeyDown);
            document.removeEventListener('keyup', _eventMoveKeyUp);
        })
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
