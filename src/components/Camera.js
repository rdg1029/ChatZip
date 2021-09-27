import { PerspectiveCamera } from "three/build/three.min";

class Camera extends PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
        this.prevPos = [
            this.position.x,
            this.position.y,
            this.position.z
        ];
        this.prevRot = [
            this.rotation.x,
            this.rotation.y
        ];
    }
    getPositionDelta() {
        const currentPos = [
            this.position.x,
            this.position.y,
            this.position.z
        ];
        const delta = [
            (currentPos[0] - this.prevPos[0]).toFixed(3),
            (currentPos[1] - this.prevPos[1]).toFixed(5),
            (currentPos[2] - this.prevPos[2]).toFixed(3)
        ];
        this.prevPos = [
            this.position.x,
            this.position.y,
            this.position.z
        ];
        return delta;
    }
    getRotationDelta() {
        const currentRot = [
            this.rotation.x,
            this.rotation.y
        ];
        const delta = [
            (currentRot[0] - this.prevRot[0]).toFixed(5),
            (currentRot[1] - this.prevRot[1]).toFixed(5)
        ];
        this.prevRot = [
            this.rotation.x,
            this.rotation.y
        ];
        return delta;
    }
}

function createCamera() {
    return new Camera(60, window.innerWidth/window.innerHeight, 0.1, 100);
}

export {createCamera};
