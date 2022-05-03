import * as THREE from 'three';

function createLight() {
    const light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1);
    light.position.set(0.5, 1, 0.75);
    light.matrixAutoUpdate = false;
    return light;
}

export {createLight};
