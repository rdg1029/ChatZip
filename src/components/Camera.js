import { PerspectiveCamera } from "three/build/three.min";

function createCamera() {
    const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, .5, 0);
    camera.prevPos = new Map([
        ['x', camera.position.x],
        ['y', camera.position.y],
        ['z', camera.position.z]
    ]);
    camera.prevRot = new Map([
        ['x', camera.rotation.x],
        ['y', camera.rotation.y],
        ['z', camera.rotation.z]
    ]);
    camera.getPositionDelta = () => {
        const delta = new Map([
            ['x', camera.position.x - camera.prevPos.get('x')],
            ['y', camera.position.y - camera.prevPos.get('y')],
            ['z', camera.position.z - camera.prevPos.get('z')]
        ]);
        camera.prevPos.set('x', camera.position.x);
        camera.prevPos.set('y', camera.position.y);
        camera.prevPos.set('z', camera.position.z);

        return delta;
    }
    camera.getRotationDelta = () => {
        const delta = new Map([
            ['x', camera.rotation.x - camera.prevRot.get('x')],
            ['y', camera.rotation.y - camera.prevRot.get('y')],
            ['z', camera.rotation.z - camera.prevRot.get('z')]
        ]);
        camera.prevRot.set('x', camera.rotation.x);
        camera.prevRot.set('y', camera.rotation.y);
        camera.prevRot.set('z', camera.rotation.z);

        return delta;
    }
    return camera;
}

export {createCamera};