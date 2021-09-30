import { PerspectiveCamera } from "three/build/three.min";

class Camera extends PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
        this.position.set(0, 0.5, 0);
    }
    getPosition() {
        return this.position.toArray();
    }
    getRotation() {
        return this.quaternion.toArray();
    }
}

function createCamera() {
    return new Camera(60, window.innerWidth/window.innerHeight, 0.1, 100);
}

export {createCamera};
