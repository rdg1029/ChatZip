import { Vector3, Group } from 'three/build/three.min';
import { NameLabel } from './NameLabel';
import { UserAppearance } from './UserAppearance';

class UserModel extends Group {
    constructor() {
        super();
        this._prevPos = new Vector3();
        this._targetPos = new Vector3();
        this._alpha = 0;

        this.nameLabel = new NameLabel('User');
        this.userAppearance = new UserAppearance();
        this.add(this.nameLabel);
        this.add(this.userAppearance);
    }
    updateMovement(buffer) {
        const mvArr = new Float32Array(buffer);
        this._prevPos.copy(this._targetPos);
        this._targetPos.set(mvArr[0], mvArr[1], mvArr[2]);
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
    }
    dispose() {
        this.nameLabel.dispose();
        this.userAppearance.dispose();
    }
}

export {UserModel};