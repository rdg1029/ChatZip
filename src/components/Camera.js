import { PerspectiveCamera } from "three/build/three.min";

function createCamera() {
    const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, .5, 0);
    camera.prevPos = new Map([
        ['x', camera.position.x],
        ['y', camera.position.y],
        ['z', camera.position.z]
    ]);
    return camera;
}

export {createCamera};