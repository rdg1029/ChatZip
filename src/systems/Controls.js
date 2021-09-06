import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class Controls extends PointerLockControls {
    constructor(camera, canvas) {
        super(camera, canvas);
        this.key = new Map();
        document.addEventListener('keydown', e => {
            this.key.set(e.key, true);
        });
        document.addEventListener('keyup', e => {
            this.key.set(e.key, false);
        });
    }
}

export {Controls};
