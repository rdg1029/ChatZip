import { PerspectiveCamera } from "three/build/three.min";

class Camera extends PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);
        this.getCurrentPos = () => {
            return [
                this.position.x.toFixed(3),
                this.position.y.toFixed(5),
                this.position.z.toFixed(3)
            ];
        }
        this.getCurrentRot = () => {
            return [
                this.rotation.x.toFixed(5),
                this.rotation.y.toFixed(5)
            ];
        }
        this.prevPos = this.getCurrentPos();
        this.prevRot = this.getCurrentRot();
    }
    getPositionDelta() {
        const currentPos = this.getCurrentPos();
        const delta = [
            (currentPos[0] - this.prevPos[0]).toFixed(3),
            (currentPos[1] - this.prevPos[1]).toFixed(5),
            (currentPos[2] - this.prevPos[2]).toFixed(3)
        ];
        this.prevPos = currentPos;
        return delta;
    }
    getRotationDelta() {
        const currentRot = this.getCurrentRot();
        const delta = [
            (currentRot[0] - this.prevRot[0]).toFixed(5),
            (currentRot[1] - this.prevRot[1]).toFixed(5)
        ];
        this.prevRot = currentRot;
        return delta;
    }
}

function createCamera() {
    return new Camera(60, window.innerWidth/window.innerHeight, 0.1, 100);
}

export {createCamera};
