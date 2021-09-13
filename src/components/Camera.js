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
        ['x', camera.rotation.x],
        ['y', camera.rotation.y],
        ['z', camera.rotation.z]
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
