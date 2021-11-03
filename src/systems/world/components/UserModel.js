import { Vector3, TextureLoader, SpriteMaterial, Sprite } from 'three';

class UserModel extends Sprite {
    constructor() {
        const map = new TextureLoader().load('../../../../dist/img/person.png');
        const material = new SpriteMaterial({map: map});
        super(material);
        
        this._prevPos = new Vector3();
        this._targetPos = new Vector3();
        // this._prevQt = new Quaternion();
        // this._targetQt = new Quaternion();

        this._alpha = 0;

        // this.geometry = new BoxGeometry(.5, .5, .5);
        // this.material = new MeshBasicMaterial({color: 0x34b1eb});
        // this.mesh = new Mesh(this.geometry, this.material);
        this.map = map;
        this.material = material;
    }
    updateMovement(buffer) {
        const mvArr = new Float32Array(buffer);
        this._prevPos.copy(this._targetPos);
        // this._prevQt.copy(this._targetQt);
        this._targetPos.set(mvArr[0], mvArr[1], mvArr[2]);
        // this._targetQt.set(mvArr[3], mvArr[4], mvArr[5], mvArr[6]);
        this._alpha = 0;
    }
    update(delta) {
        if (this._alpha == 1) return;
        if (this._alpha > 1) {
            this._alpha = 1;
        }
        else {
            this._alpha += delta * 10;
        }
        this.position.lerpVectors(this._prevPos, this._targetPos, this._alpha);
        // this.mesh.quaternion.slerpQuaternions(this._prevQt, this._targetQt, this._alpha);
    }
    dispose() {
        this.map.dispose();
        this.material.dispose();
    }
}

export {UserModel};
