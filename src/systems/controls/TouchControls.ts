import { Camera } from "three";
import { Peer } from "../connection/Peer";
import Controls from "./Controls";

type Peers = Map<string, Peer>;

const _prevPos: number[] = [undefined, undefined];

export default class TouchControls extends Controls {
    constructor(camera: Camera, canvas: HTMLCanvasElement, peers: Peers) {
        super(camera, canvas, peers);

        const scope = this;

        function onTouchStart(e: TouchEvent) {
            const touches = e.changedTouches[0];
            _prevPos[0] = touches.pageX;
            _prevPos[1] = touches.pageY;
        }

        function onTouchMove(e: TouchEvent) {    
            const touches = e.touches[0];
            const movementX = _prevPos[0] - touches.pageX
            const movementY = _prevPos[1] - touches.pageY 
            scope.moveCamera(movementX, movementY);
            _prevPos[0] = touches.pageX;
            _prevPos[1] = touches.pageY;
        }

        const ownerDocument = this.domElement.ownerDocument;
        ownerDocument.addEventListener('touchstart', onTouchStart);
        ownerDocument.addEventListener('touchmove', onTouchMove);

        const dirButtons = document.getElementById('dir-buttons');
        const dirForward = document.getElementById('btn-dir-forward');
        const dirLeft = document.getElementById('btn-dir-left');
        const dirJump = document.getElementById('btn-dir-jump');
        const dirRight = document.getElementById('btn-dir-right');
        const dirBack = document.getElementById('btn-dir-back');

        dirButtons.style.display = 'unset';
        dirForward.addEventListener('touchstart', () => scope.movements.set('forward', true));
        dirForward.addEventListener('touchend', () => scope.movements.set('forward', false));
        dirLeft.addEventListener('touchstart', () => scope.movements.set('left', true));
        dirLeft.addEventListener('touchend', () => scope.movements.set('left', false));
        dirJump.addEventListener('touchstart', () => scope.movements.set('jump', true));
        dirJump.addEventListener('touchend', () => scope.movements.set('jump', false));
        dirRight.addEventListener('touchstart', () => scope.movements.set('right', true));
        dirRight.addEventListener('touchend', () => scope.movements.set('right', false));
        dirBack.addEventListener('touchstart', () => scope.movements.set('back', true));
        dirBack.addEventListener('touchend', () => scope.movements.set('back', false));
    }
}
