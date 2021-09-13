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
        const currentPosX = camera.position.x;
        const currentPosY = camera.position.y;
        const currentPosZ = camera.position.z;
        const delta = new Map([
            ['x', (currentPosX - camera.prevPos.get('x')).toFixed(3)],
            ['y', (currentPosY - camera.prevPos.get('y')).toFixed(5)],
            ['z', (currentPosZ - camera.prevPos.get('z')).toFixed(3)]
        ]);
        camera.prevPos.set('x', currentPosX);
        camera.prevPos.set('y', currentPosY);
        camera.prevPos.set('z', currentPosZ);

        return delta;
    }
    camera.getRotationDelta = () => {
        const currentRotX = camera.rotation.x;
        const currentRotY = camera.rotation.y;
        const currentRotZ = camera.rotation.z;
        const delta = new Map([
            ['x', (currentRotX - camera.prevRot.get('x')).toFixed(5)],
            ['y', (currentRotY - camera.prevRot.get('y')).toFixed(5)],
            ['z', (currentRotZ - camera.prevRot.get('z')).toFixed(5)]
        ]);
        camera.prevRot.set('x', currentRotX);
        camera.prevRot.set('y', currentRotY);
        camera.prevRot.set('z', currentRotZ);

        return delta;
    }
    return camera;
}

export {createCamera};
