import { PerspectiveCamera } from "three/build/three.min";

function createCamera() {
    return new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
}

export {createCamera};