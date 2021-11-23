import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const _prevMoveBuffer = new ArrayBuffer(12),
    _currentMoveBuffer = new ArrayBuffer(12),
    _prevMoveArray = new Float32Array(_prevMoveBuffer),
    _currentMoveArray = new Float32Array(_currentMoveBuffer);

function _isMove() {
    for (let i = 0; i < 3; i++) {
        if (_prevMoveArray[i] !== _currentMoveArray[i]) {
            return true;
        }
    }
    return false;
}

class Controls extends PointerLockControls {
    constructor(camera, canvas, peers, chat, menu) {
        super(camera, canvas);
        this.camera = camera;
        this.peers = peers;
        this.key = new Map([
            ['KeyW', false],
            ['ArrowUp', false],
            ['KeyA', false],
            ['ArrowLeft', false],
            ['KeyS', false],
            ['ArrowDown', false],
            ['KeyD', false],
            ['ArrowRight', false]
        ]);

        const scope = this;
        function _eventMoveKeyDown(e) {
            switch(e.code) {
                case 'Enter':
                    menu.isReady = false;
                    scope.unlock();
                    chat.showComponent();
                    chat.input.focus();                    
                    break;
                case 'KeyC':
                    chat.isVisible = !chat.isVisible;
                    if (chat.isVisible) {
                        chat.showComponent();
                    }
                    else {
                        chat.hideComponent()
                    }
                    break;
                default:
                    if (!scope.key.has(e.code)) return;
                    if (scope.key.get(e.code)) return;
                    scope.key.set(e.code, true);

            }
        }

        function _eventMoveKeyUp(e) {
            if (!scope.key.has(e.code)) return;
            if (!scope.key.get(e.code)) return;
            scope.key.set(e.code, false);
        }

        this.addEventListener('lock', e => {
            document.addEventListener('keydown', _eventMoveKeyDown);
            document.addEventListener('keyup', _eventMoveKeyUp);
            if (!menu.isReady) {
                menu.isReady = true;
            }
            if (!chat.isVisible) {
                chat.hideComponent();
            }
        });
        this.addEventListener('unlock', e => {
            document.removeEventListener('keydown', _eventMoveKeyDown);
            document.removeEventListener('keyup', _eventMoveKeyUp);
            if (!menu.isReady) return;
            menu.open();
        });
        canvas.addEventListener('click', () => {
            this.lock();
        });
        menu.btnClose.onclick = () => {
            menu.close();
            this.lock();
        }
        menu.btnExit.onclick = () => {
            location.reload();
        }
    }
    update(delta) {
        const speed = (10 * delta).toFixed(3);
        if (this.key.get('KeyW') || this.key.get('ArrowUp')) {
            this.moveForward(speed);
        }
        if (this.key.get('KeyA') || this.key.get('ArrowLeft')) {
            this.moveRight(-speed);
        }
        if (this.key.get('KeyS') || this.key.get('ArrowDown')) {
            this.moveForward(-speed);
        }
        if (this.key.get('KeyD') || this.key.get('ArrowRight')) {
            this.moveRight(speed);
        }
    }
    tick() {
        const pos = this.camera.getPosition();
        // const qt = this.camera.getQuaternion();

        _prevMoveArray.set(_currentMoveArray);
        _currentMoveArray.set(pos);
        // _currentMoveArray.set(qt, 3);

        if (!_isMove()) return;
        
        // console.log(movementArray);

        const peers = Array.from(this.peers.values());
        for (let i = 0, j = peers.length; i < j; i++) {
            peers[i].sendMovement(_currentMoveBuffer);
        }
    }
}

export {Controls};
