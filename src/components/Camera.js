import { PerspectiveCamera } from "three/build/three.min";

function createCamera() {
    const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, .5, 0);
    camera.prevPos = new Map([
        ['x', parseFloat(camera.position.x.toFixed(3))],
        ['y', parseFloat(camera.position.y.toFixed(5))],
        ['z', parseFloat(camera.position.z.toFixed(3))]
    ]);
    camera.prevRot = new Map([
        ['x', parseFloat(camera.rotation.x.toFixed(5))],
        ['y', parseFloat(camera.rotation.y.toFixed(5))],
        ['z', parseFloat(camera.rotation.z.toFixed(5))]
    ]);
    camera.getPositionDelta = () => {
        const currentPosX = parseFloat(camera.position.x.toFixed(3));
        const currentPosY = parseFloat(camera.position.y.toFixed(5));
        const currentPosZ = parseFloat(camera.position.z.toFixed(3));
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
        const currentRotX = parseFloat(camera.rotation.x.toFixed(5));
        const currentRotY = parseFloat(camera.rotation.y.toFixed(5));
        const currentRotZ = parseFloat(camera.rotation.z.toFixed(5));
        const delta = new Map([
            ['x', currentRotX - camera.prevRot.get('x')],
            ['y', currentRotY - camera.prevRot.get('y')],
            ['z', currentRotZ - camera.prevRot.get('z')]
        ]);
        camera.prevRot.set('x', currentRotX);
        camera.prevRot.set('y', currentRotY);
        camera.prevRot.set('z', currentRotZ);

        return delta;
    }
    return camera;
}

export {createCamera};
