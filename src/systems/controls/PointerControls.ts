import { Camera } from "three";
import Controls from "./Controls";
import { Peer } from "../connection/Peer";
import { Chat } from '../Chat';
import { Menu } from "../Menu";

type Peers = Map<string, Peer>;

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

class PointerControls extends Controls {
    private key: Array<string>;
    private connect: Function;
    private disconnect: Function;
    public isLocked: boolean;

    constructor(camera: Camera, canvas: HTMLCanvasElement, peers: Peers, chat: Chat, menu: Menu) {
        super(camera, canvas, peers);
        this.key = [
            'KeyW', 
            'ArrowUp', 
            'KeyA', 
            'ArrowLeft', 
            'KeyS', 
            'ArrowDown', 
            'KeyD', 
            'ArrowRight', 
            'Space', 
        ];
        this.isLocked = false;

        const scope = this;

        function _updateMovementFromKey(keyCode: string, isDown: boolean) {
            if (!scope.key.includes(keyCode)) return;
            if (keyCode === 'KeyW' || keyCode === 'ArrowUp') {
                scope.movements.set('forward', isDown);
            }
            if (keyCode === 'KeyS' || keyCode === 'ArrowDown') {
                scope.movements.set('back', isDown);
            }
            if (keyCode === 'KeyA' || keyCode === 'ArrowLeft') {
                scope.movements.set('left', isDown);
            }
            if (keyCode === 'KeyD' || keyCode === 'ArrowRight') {
                scope.movements.set('right', isDown);
            }
            if (keyCode === 'Space') {
                scope.movements.set('jump', isDown);
            }
        }

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
                    _updateMovementFromKey(e.code, true);

            }
        }

        function _eventMoveKeyUp(e: KeyboardEvent) {
            _updateMovementFromKey(e.code, false);
        }

        function onMouseMove(e: MouseEvent) {
            if (!scope.isLocked) return;
            const movementX = e.movementX || 0;
            const movementY = e.movementY || 0;
            scope.moveCamera(movementX, movementY);
            scope.dispatchEvent(_changeEvent);
        }

        function onPointerLockChange() {
            if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {
                scope.dispatchEvent(_lockEvent);
                scope.isLocked = true;
            } else {
                scope.dispatchEvent(_unlockEvent);
                scope.isLocked = false;
            }
        }
        function onPointerLockError() {
            console.error( 'Unable to use Pointer Lock API' );
        }

        this.connect = () => {
            const ownerDocument = scope.domElement.ownerDocument;
            ownerDocument.addEventListener('mousemove', onMouseMove);
            ownerDocument.addEventListener('pointerlockchange', onPointerLockChange);
            ownerDocument.addEventListener('pointerlockerror', onPointerLockError);
        }

        this.disconnect = () => {
            const ownerDocument = scope.domElement.ownerDocument;
            ownerDocument.addEventListener('mousemove', onMouseMove);
            ownerDocument.addEventListener('pointerlockchange', onPointerLockChange);
            ownerDocument.addEventListener('pointerlockerror', onPointerLockError);
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
        this.connect();
    }

    public lock() {
        this.domElement.requestPointerLock();
    }

    public unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    }
}

export {PointerControls};
