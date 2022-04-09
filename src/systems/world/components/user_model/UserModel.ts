import { Vector3, Group } from 'three';
import { NameLabel } from './NameLabel';
import { UserAppearance } from './UserAppearance';

class UserModel extends Group {
    private prevPos: Vector3;
    private targetPos: Vector3;
    private alpha: number;

    public nameLabel: NameLabel;
    public userAppearance: UserAppearance;

    constructor(name: string) {
        super();
        this.prevPos = new Vector3();
        this.targetPos = new Vector3();
        this.alpha = 0;

        this.nameLabel = new NameLabel(name);
        this.userAppearance = new UserAppearance();
        this.add(this.nameLabel);
        this.add(this.userAppearance);
    }
    updateMovement(buffer: ArrayBuffer) {
        const mvArr = new Float32Array(buffer);
        this.prevPos.copy(this.targetPos);
        this.targetPos.set(mvArr[0], mvArr[1], mvArr[2]);
        this.alpha = 0;
    }
    update(delta: number) {
        if (this.alpha == 1) return;
        if (this.alpha > 1) {
            this.alpha = 1;
        }
        else {
            this.alpha += delta * 10;
        }
        this.position.lerpVectors(this.prevPos, this.targetPos, this.alpha);
    }
    dispose() {
        this.nameLabel.dispose();
        this.userAppearance.dispose();
    }
}

export {UserModel};