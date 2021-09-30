import { Quaternion, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

class UserModel {
    constructor() {
        this.geometry = new BoxGeometry(.5, .5, .5);
        this.material = new MeshBasicMaterial({color: 0x34b1eb});
        this.mesh = new Mesh(this.geometry, this.material);
    }
    updateMovement(buffer) {
        const mvArr = new Float32Array(buffer);
        const targetPos = new Vector3(mvArr[0], mvArr[1], mvArr[2]);
        const targetQt = new Quaternion(mvArr[3], mvArr[4], mvArr[5], mvArr[6]);
        this.mesh.position.lerp(targetPos, 0.75);
        this.mesh.quaternion.slerp(targetQt, 0.75);
    }
    update(delta) {
        /*
        const defaultSpeed = 10 * delta;
        this.mesh.position.x += (defaultSpeed * this.speed[0]).toFixed(3);
        this.mesh.position.y += (defaultSpeed * this.speed[1]).toFixed(5);
        this.mesh.position.z += (defaultSpeed * this.speed[2]).toFixed(3);
        this.mesh.rotation.x += (defaultSpeed * this.speed[3]).toFixed(5);
        this.mesh.rotation.y += (defaultSpeed * this.speed[4]).toFixed(5);
        */
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export {UserModel};
