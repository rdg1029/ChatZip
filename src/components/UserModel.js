import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

class UserModel {
    constructor() {
        this.geometry = new BoxGeometry(.5, .5, .5);
        this.material = new MeshBasicMaterial({color: 0x34b1eb});
        this.mesh = new Mesh(this.geometry, this.material);
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
        this.mesh.position.x += (defaultSpeed * this.speed.get('posX')).toFixed(3);
        this.mesh.position.y += (defaultSpeed * this.speed.get('posY')).toFixed(5);
        this.mesh.position.z += (defaultSpeed * this.speed.get('posZ')).toFixed(3);
        this.mesh.rotation.x += (defaultSpeed * this.speed.get('rotX')).toFixed(5);
        this.mesh.rotation.y += (defaultSpeed * this.speed.get('rotY')).toFixed(5);
        this.mesh.rotation.z += (defaultSpeed * this.speed.get('rotZ')).toFixed(5);
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export {UserModel};
