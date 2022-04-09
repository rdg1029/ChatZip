import { Camera } from "three";
import { Peer } from "../connection/Peer";
import { Chat } from '../Chat';
import { Menu } from "../Menu";
import { PointerLockControls } from "./PointerLockControls";
import { user } from "../User";

type Peers = Map<string, Peer>;

const userState = user.state;
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
    camera: Camera;
    private peers: Peers;
    private key: Map<string, boolean>;

    constructor(camera: Camera, canvas: HTMLCanvasElement, peers: Peers, chat: Chat, menu: Menu) {
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
            ['ArrowRight', false],
            ['Space', false],
        ]);

        const scope = this;
        function _eventMoveKeyDown(e: KeyboardEvent) {
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

        function _eventMoveKeyUp(e: KeyboardEvent) {
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
    update(delta: number) {
        const speed = (userState.speed * delta).toFixed(3);
        const {displacement, key} = this;
        displacement.fromArray(userState.pos);
        if (key.get('KeyW') || key.get('ArrowUp')) {
            this.moveForward(speed);
        }
        if (key.get('KeyA') || key.get('ArrowLeft')) {
            this.moveRight(-speed);
        }
        if (key.get('KeyS') || key.get('ArrowDown')) {
            this.moveForward(-speed);
        }
        if (key.get('KeyD') || key.get('ArrowRight')) {
            this.moveRight(speed);
        }
        if (key.get('Space')) {
            if (userState.onGround) {
                userState.gravAccel = userState.jumpHeight;
            }
        }
        // Return velocity
        return [
            displacement.x - userState.pos[0],
            displacement.y - userState.pos[1],
            displacement.z - userState.pos[2],
        ]
    }
    tick() {
        // const qt = this.camera.getQuaternion();
        _prevMoveArray.set(_currentMoveArray);
        _currentMoveArray.set(user.state.pos);
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
