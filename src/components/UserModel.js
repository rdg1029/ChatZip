import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

function createUserModel() {
    const userGeometry = new BoxGeometry(.5, .5, .5);
    const userMaterial = new MeshBasicMaterial({color: 0x34b1eb});
    const userMesh = new Mesh(userGeometry, userMaterial);
    userMesh.dispose = () => {
        userGeometry.dispose();
        userMaterial.dispose();
    }
    return userMesh;
}

export {createUserModel};
