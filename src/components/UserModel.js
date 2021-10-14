import { Quaternion, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

let alpha = 0;

class UserModel {
    constructor() {
        this._prevPos = new Vector3();
        this._targetPos = new Vector3();
        this._prevQt = new Quaternion();
        this._targetQt = new Quaternion();

        this.geometry = new BoxGeometry(.5, .5, .5);
        this.material = new MeshBasicMaterial({color: 0x34b1eb});
        this.mesh = new Mesh(this.geometry, this.material);
    }
    updateMovement(buffer) {
        const mvArr = new Float32Array(buffer);
        this._prevPos.copy(this._targetPos);
        this._prevQt.copy(this._targetQt);
        this._targetPos.set(mvArr[0], mvArr[1], mvArr[2]);
        this._targetQt.set(mvArr[3], mvArr[4], mvArr[5], mvArr[6]);
        alpha = 0;
    }
    update(delta) {
        if (alpha == 1) return;
        if (alpha > 1) {
            alpha = 1;
        }
        else {
            alpha += delta * 10;
        }
        this.mesh.position.lerpVectors(this._prevPos, this._targetPos, alpha);
        this.mesh.quaternion.slerpQuaternions(this._prevQt, this._targetQt, alpha);
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export {UserModel};
