import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

let canvas, renderer, scene, camera, pointerLockControls;
let keyControls = {};

function initRoom() {
    canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, .5, -5);
    camera.lookAt(new THREE.Vector3(0, .5, 0));

    pointerLockControls = new PointerLockControls(camera, canvas);

    document.addEventListener('keydown', e => {
        keyControls[e.key] = true;
    });

    document.addEventListener('keyup', e => {
        keyControls[e.key] = false;
    });

    window.addEventListener('resize', () => {
        let w = window.innerWidth;
        let h = window.innerHeight;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    canvas.addEventListener('click', () => {
        pointerLockControls.lock();
    });

    setSkyBox();
    createPlane();
    render();
}

function setControl() {
    if(keyControls['w']) {
        pointerLockControls.moveForward(.1);
    }
    if(keyControls['s']) {
        pointerLockControls.moveForward(-.1);
    }
    if(keyControls['a']) {
        pointerLockControls.moveRight(-.1);
    }
    if(keyControls['d']) {
        pointerLockControls.moveRight(.1);
    }
}

function setSkyBox() {
    const textureLoader = new THREE.CubeTextureLoader();
    const texture = textureLoader.load([
        '../dist/img/skybox/px.bmp',
        '../dist/img/skybox/nx.bmp',
        '../dist/img/skybox/py.bmp',
        '../dist/img/skybox/ny.bmp',
        '../dist/img/skybox/pz.bmp',
        '../dist/img/skybox/nz.bmp'
    ]);
    scene.background = texture;
}

function createPlane() {
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

function render() {
    renderer.render(scene, camera);
    setControl();
    requestAnimationFrame(render);
}

export {initRoom};