import { PlaneGeometry, MeshBasicMaterial, Mesh } from "three/build/three.min";

function createPlane() {
    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMaterial = new MeshBasicMaterial({color: 0xffffff});
    return new Mesh(planeGeometry, planeMaterial);
}

export {createPlane};