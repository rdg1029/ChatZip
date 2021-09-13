import { PerspectiveCamera } from "three/build/three.min";

function createCamera() {
    const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, .5, 0);
    camera.prevPos = new Map([
        ['x', camera.position.x.toFixed(3)],
        ['y', camera.position.y.toFixed(5)],
        ['z', camera.position.z.toFixed(3)]
    ]);
    camera.prevRot = new Map([
        ['x', camera.rotation.x.toFixed(5)],
        ['y', camera.rotation.y.toFixed(5)],
        ['z', camera.rotation.z.toFixed(5)]
    ]);
    camera.getPositionDelta = () => {
        const currentPosX = camera.position.x.toFixed(3);
        const currentPosY = camera.position.y.toFixed(5);
        const currentPosZ = camera.position.z.toFixed(3);
        const delta = new Map([
            ['x', currentPosX - camera.prevPos.get('x')],
            ['y', currentPosY - camera.prevPos.get('y')],
            ['z', currentPosZ - camera.prevPos.get('z')]
        ]);
        camera.prevPos.set('x', currentPosX);
        camera.prevPos.set('y', currentPosY);
        camera.prevPos.set('z', currentPosZ);

        return delta;
    }
    camera.getRotationDelta = () => {
        const currentRotX = camera.rotation.x.toFixed(5);
        const currentRotY = camera.rotation.y.toFixed(5);
        const currentRotZ = camera.rotation.z.toFixed(5);
        const delta = new Map([
            ['x', currentRotX - camera.prevRot.get('x')],
            ['y', currentRotY - camera.prevRot.get('y')],
            ['z', currentRotZ - camera.prevRot.get('z')]
        ]);
        camera.prevRot.set('x', currentRotX);
        camera.prevRot.set('y', currentRotY);
        camera.prevRot.set('z', currentRotZ)

        return delta;
    }
    return camera;
}

export {createCamera};
