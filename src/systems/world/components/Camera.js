import { PerspectiveCamera } from "three";
import { user } from "../../User";

class Camera extends PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
        this.updatePosition();
    }
    updatePosition() {
        this.position.set(user.state.pos[0], user.state.pos[1] + 12, user.state.pos[2])
    }
    getPosition() {
        return this.position.toArray();
    }
    /*
    getQuaternion() {
        return this.quaternion.toArray();
    }
    */
}

function createCamera() {
    return new Camera(60, window.innerWidth/window.innerHeight, 0.1, 100);
}

export {createCamera};
