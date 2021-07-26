import * as THREE from 'three';
import {scene} from './room.js';

class UserModel {
    constructor() {
        this.userGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.userMaterial = new THREE.MeshBasicMaterial({color: 0x34b1eb});
        this.userMesh = new THREE.Mesh(this.userGeometry, this.userMaterial);
    }
    add() {
        scene.add(this.userMesh);
    }
    remove() {
        scene.remove(this.userMesh);
        this.userGeometry.dispose();
        this.userMaterial.dispose();
    }
}

export {UserModel};