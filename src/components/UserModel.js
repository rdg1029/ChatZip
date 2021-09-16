import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

class UserModel {
    constructor() {
        this.userGeometry = new BoxGeometry(.5, .5, .5);
        this.userMaterial = new MeshBasicMaterial({color: 0x34b1eb});
        this.userMesh = new Mesh(this.userGeometry, this.userMaterial);
        this.speed = new Map([
            ['posX', 0],
            ['posY', 0],
            ['posZ', 0],
            ['rotX', 0],
            ['rotY', 0],
            ['rotZ', 0]
        ]);
    }
    update(delta) {
        const defaultSpeed = 10 * delta;
        this.userMesh.position.x += (defaultSpeed * this.speed.get('posX')).toFixed(3);
        this.userMesh.position.y += (defaultSpeed * this.speed.get('posY')).toFixed(5);
        this.userMesh.position.z += (defaultSpeed * this.speed.get('posZ')).toFixed(3);
        this.userMesh.rotation.x += (defaultSpeed * this.speed.get('rotX')).toFixed(5);
        this.userMesh.rotation.y += (defaultSpeed * this.speed.get('rotY')).toFixed(5);
        this.userMesh.rotation.z += (defaultSpeed * this.speed.get('rotZ')).toFixed(5);
    }
    dispose() {
        this.userGeometry.dispose();
        this.userMaterial.dispose();
    }
}

export {UserModel};
