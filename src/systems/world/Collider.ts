import * as THREE from 'three';
import { user } from '../User';
import { VoxelMap } from './components/map/VoxelMap';
import { PointerControls } from '../controls/PointerControls';
import TouchControls from '../controls/TouchControls';

const NO_COLLISION = 1;
const EPSILON = 0.001;

const userSize = user.collision;
const userState = user.state;
const userPos = userState.pos;

class Collider {
    private voxelMap: VoxelMap;
    private controls: PointerControls|TouchControls;
    private size: THREE.Vector3;

    public box : THREE.Box3;
    public helper: THREE.Box3Helper;
    

    constructor(voxelMap: VoxelMap, controls: PointerControls|TouchControls) {
        this.voxelMap = voxelMap;
        this.controls = controls;
        this.box = new THREE.Box3();
        this.helper = new THREE.Box3Helper(this.box);
        this.size = new THREE.Vector3(userSize.width, userSize.height, userSize.depth);
    }
    updateBox() {
        const {box, size} = this;
        const boxCenter = new THREE.Vector3().set(userPos[0], userPos[1] + 7, userPos[2]);
        box.setFromCenterAndSize(boxCenter, size);
    }
    sweptAABB(voxelX: number, voxelY: number, voxelZ: number, velocity: Array<number>) {
        const {box} = this;
        const normal = new Int8Array(3);
        const xInvEntry = velocity[0] > 0 ? voxelX - box.max.x : (voxelX + 1) - box.min.x;
        const xInvExit = velocity[0] > 0 ? (voxelX + 1) - box.min.x : voxelX - box.max.x;
        const yInvEntry = velocity[1] > 0 ? voxelY - box.max.y : (voxelY + 1) - box.min.y;
        const yInvExit = velocity[1] > 0 ? (voxelY + 1) - box.min.y : voxelY - box.max.y;
        const zInvEntry = velocity[2] > 0 ? voxelZ - box.max.z : (voxelZ + 1) - box.min.z;
        const zInvExit = velocity[2] > 0 ? (voxelZ + 1) - box.min.z : voxelZ - box.max.z;
    
        const xEntry = velocity[0] === 0 ? -Infinity : xInvEntry / velocity[0];
        const xExit = velocity[0] === 0 ? Infinity : xInvExit / velocity[0];
        const yEntry = velocity[1] === 0 ? -Infinity : yInvEntry / velocity[1];
        const yExit = velocity[1] === 0 ? Infinity : yInvExit / velocity[1];
        const zEntry = velocity[2] === 0 ? -Infinity : zInvEntry / velocity[2];
        const zExit = velocity[2] === 0 ? Infinity : zInvExit / velocity[2];
    
        const entryTime = Math.max(xEntry, yEntry, zEntry);
        const exitTime = Math.min(xExit, yExit, zExit);
        //if no collision
        if (entryTime > exitTime || entryTime < 0) {
            return {NO_COLLISION, normal};
        }
        else {
            normal[0] = entryTime === xEntry ? -Math.sign(velocity[0]) : 0;
            normal[1] = entryTime === yEntry ? -Math.sign(velocity[1]) : 0;
            normal[2] = entryTime === zEntry ? -Math.sign(velocity[2]) : 0;
            return {entryTime, normal};
        }
    }
    update(delta: number) {
        const { voxelMap, controls, box } = this;
        const velocity = controls.update(delta);
        // Apply gravity
        userState.gravAccel -= userState.gravity * delta;
        velocity[1] += userState.gravAccel * delta;

        const displacement = [...velocity];
        let collisionTime = 1;

        userState.velocity = velocity;
        this.updateBox();

        for (let i = 0; i < 3; i++) {
            collisionTime = 1;
            let collNormal = new Int8Array(3);
            const minX = Math.floor(box.min.x + velocity[0]);
            const maxX = Math.ceil(box.max.x + velocity[0]);
            const minY = Math.floor(box.min.y + velocity[1]);
            const maxY = Math.ceil(box.max.y + velocity[1]);
            const minZ = Math.floor(box.min.z + velocity[2]);
            const maxZ = Math.ceil(box.max.z + velocity[2]);
            for (let y = minY; y < maxY; y++) {
                for (let x = minX; x < maxX; x++) {
                    for (let z = minZ; z < maxZ; z++) {
                        if (voxelMap.getVoxel(x, y, z) === 0) continue;
                        const {entryTime, normal} = this.sweptAABB(x, y, z, velocity);
                        if (entryTime === 1) continue;
                        if (entryTime < collisionTime) {
                            collisionTime = entryTime;
                            collNormal = normal;
                        } 
                    }
                }
            }
            if (collisionTime === 1) break;
            collisionTime -= EPSILON;
            if (collNormal[0] !== 0) {
                velocity[0] = 0;
                displacement[0] *= collisionTime;
                continue;
            }
            if (collNormal[1] !== 0) {
                if (collNormal[1] === 1) {
                    userState.onGround = true;
                }
                userState.gravAccel = 0;
                velocity[1] = 0;
                displacement[1] *= collisionTime;
                continue;
            }
            if (collNormal[2] !== 0) {
                velocity[2] = 0;
                displacement[2] *= collisionTime;
            }
        }
        if (userState.gravAccel !== 0) userState.onGround = false;
        userPos[0] += displacement[0];
        userPos[1] += displacement[1];
        userPos[2] += displacement[2];
        this.updateBox();
    }
}

export {Collider};
