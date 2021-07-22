import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

let canvas, renderer, scene, camera, controls;

function initRoom() {
    canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1, 0);
    controls.update();

    window.addEventListener('resize', () => {
        let w = window.innerWidth;
        let h = window.innerHeight;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    setSkyBox();
    createPlane();
    render();
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
    requestAnimationFrame(render);
}

export {initRoom};