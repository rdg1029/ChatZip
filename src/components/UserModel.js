import { Quaternion, Vector3 } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three/build/three.min';

const _prevPos = new Vector3(), _targetPos = new Vector3();
const _prevQt = new Quaternion(), _targetQt = new Quaternion();
let alpha = 0;

class UserModel {
    constructor() {
        this.geometry = new BoxGeometry(.5, .5, .5);
        this.material = new MeshBasicMaterial({color: 0x34b1eb});
        this.mesh = new Mesh(this.geometry, this.material);
    }
    updateMovement(buffer) {
        const mvArr = new Float32Array(buffer);
        _prevPos.copy(_targetPos);
        _prevQt.copy(_targetQt);
        _targetPos.set(mvArr[0], mvArr[1], mvArr[2]);
        _targetQt.set(mvArr[3], mvArr[4], mvArr[5], mvArr[6]);
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
        this.mesh.position.lerpVectors(_prevPos, _targetPos, alpha);
        this.mesh.quaternion.slerpQuaternions(_prevQt, _targetQt, alpha);
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export {UserModel};
