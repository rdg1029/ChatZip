import { Euler, Vector3 } from "three";
import { Camera } from "../world/components/Camera";
import { user } from "../User";

const _euler = new Euler(0, 0, 0, "YXZ");
const _vector = new Vector3();

const _PI_2 = Math.PI / 2;

export default class Controls {
    private movements: Map<string, boolean>;
    private camera: Camera;
    private displacement: Vector3;
    public domElement: HTMLCanvasElement;
    public screenSpeed: number;

    constructor(camera: Camera ,domElement: HTMLCanvasElement) {
        this.movements = new Map([
            ['forward', false],
            ['back', false],
            ['left', false],
            ['right', false],
            ['jump', false],
        ]);
        this.camera = camera;
        this.displacement = new Vector3().fromArray(user.state.pos);

        this.domElement = domElement;
        this.screenSpeed = 1.0;
    }

    public onScreenMove(movementX: number, movementY: number) {
        const { camera, screenSpeed } = this;
        _euler.setFromQuaternion(camera.quaternion);
        _euler.x -= movementY * 0.002 * screenSpeed;
        _euler.y -= movementX * 0.002 * screenSpeed;
        _euler.x = Math.max(-_PI_2, Math.min(_PI_2, _euler.x));
        camera.quaternion.setFromEuler(_euler);
    }

    public moveForward(distance: number) {
        const { camera, displacement } = this;
        _vector.setFromMatrixColumn(camera.matrix, 0);
        _vector.crossVectors(camera.up, _vector);
        displacement.addScaledVector(_vector, distance);
    }

    public moveRight(distance: number) {
        const { camera, displacement } = this;
        _vector.setFromMatrixColumn(camera.matrix, 0);
        displacement.addScaledVector(_vector, distance);
    }

    public update(delta: number) {
        const userState = user.state;
        const speed = userState.speed * delta;
        const { movements, displacement } = this;
        displacement.fromArray(userState.pos);
        if (movements.get('forward')) {
            this.moveForward(speed);
        }
        if (movements.get('back')) {
            this.moveForward(-speed);
        }
        if (movements.get('left')) {
            this.moveRight(-speed);
        }
        if (movements.get('right')) {
            this.moveRight(speed);
        }
        if (movements.get('jump')) {
            if (userState.onGround) {
                userState.gravAccel = userState.jumpHeight;
            }
        }
        // Return velocity
        return [
            displacement.x - userState.pos[0],
            displacement.y - userState.pos[1],
            displacement.z - userState.pos[2],
        ]
    }
}