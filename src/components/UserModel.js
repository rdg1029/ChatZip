import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

class UserModel {
    constructor() {
        this.geometry = new BoxGeometry(.5, .5, .5);
        this.material = new MeshBasicMaterial({color: 0x34b1eb});
        this.mesh = new Mesh(this.geometry, this.material);
        this.speed = [0, 0, 0, 0, 0];
    }
    update(delta) {
        const defaultSpeed = 10 * delta;
        this.mesh.position.x += (defaultSpeed * this.speed[0]).toFixed(3);
        this.mesh.position.y += (defaultSpeed * this.speed[1]).toFixed(5);
        this.mesh.position.z += (defaultSpeed * this.speed[2]).toFixed(3);
        this.mesh.rotation.x += (defaultSpeed * this.speed[3]).toFixed(5);
        this.mesh.rotation.y += (defaultSpeed * this.speed[4]).toFixed(5);
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export {UserModel};
