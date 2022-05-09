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
            const touches = e.changedTouches[0];
            const movementX = (_prevPos[0] - touches.pageX) || 0;
            const movementY = (_prevPos[1] - touches.pageY) || 0;
            scope.moveCamera(movementX, movementY, 0.1);
        }

        const ownerDocument = this.domElement.ownerDocument;
        ownerDocument.addEventListener('touchstart', onTouchStart);
        ownerDocument.addEventListener('touchmove', onTouchMove);
    }
}
