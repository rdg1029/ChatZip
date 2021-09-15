import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

function createUserModel() {
    const userGeometry = new BoxGeometry(.5, .5, .5);
    const userMaterial = new MeshBasicMaterial({color: 0x34b1eb});
    const userMesh = new Mesh(userGeometry, userMaterial);

    userMesh.speed = new Map([
        ['posX', 0],
        ['posY', 0],
        ['posZ', 0],
        ['rotX', 0],
        ['rotY', 0],
        ['rotZ', 0]
    ]);

    userMesh.update = delta => {
        const defaultSpeed = 10 * delta;
        userMesh.position.x += (defaultSpeed * speed.get('posX')).toFixed(3);
        userMesh.position.y += (defaultSpeed * speed.get('posY')).toFixed(5);
        userMesh.position.z += (defaultSpeed * speed.get('posZ')).toFixed(3);
        userMesh.rotation.x += (defaultSpeed * speed.get('rotX')).toFixed(5);
        userMesh.rotation.y += (defaultSpeed * speed.get('rotY')).toFixed(5);
        userMesh.rotation.z += (defaultSpeed * speed.get('rotZ')).toFixed(5);
    }

    userMesh.dispose = () => {
        userGeometry.dispose();
        userMaterial.dispose();
    }
    return userMesh;
}

export {createUserModel};
