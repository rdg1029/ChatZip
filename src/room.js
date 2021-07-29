import {Peer, peers} from './peer.js';
import {group} from './group.js';
import {socket} from './socket.js';
import {showChat} from './chat.js';

import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

let renderer, scene, camera, pointerLockControls;
let keyControls = {};

function initRoom() {
    const canvas = document.getElementById('c');
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

    document.addEventListener('mousemove', () => {
        sendMovementToPeers();
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

    /*Set socket listener*/
    socket.on('user join', userId => {
        group.addUser(userId);
        showChat(userId + " joined group");
        peers[userId].model.add();
        peers[userId].model.userMesh.position.set(0, .5, 0);
        // console.log(group.users);
    });
    
    socket.on('req offer', targetId => {
        //console.log(targetId, 'request your info');
        peers[targetId] = new Peer('offer', targetId);
        peers[targetId].createOffer();
    });
    
    socket.on('recv answer', (answer, targetId) => {
        peers[targetId].receiveAnswer(answer);
        //group.addUser(targetId);
        socket.emit('conn ready', targetId);
        // console.log(group.users);
    });
    
    socket.on('user quit', userId => {
        peers[userId].model.remove();
        peers[userId].close();
        peers[userId].model = null;
        peers[userId] = null;
        delete peers[userId];
        group.removeUser(userId);
        showChat(userId + " quit");
        // console.log('closed with :', userId);
        // console.log(group.users);
    });
    
    /*Set sky box*/
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
    
    /*Create plane*/
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
    
    render();

    /*Render users*/
    Object.keys(peers).forEach(p => peers[p].model.add());
}

function sendMovementToPeers() {
    Object.keys(peers).forEach(p => {
        if(peers[p].movementChannel.readyState != 'open') return;
        const movementBuffer = new ArrayBuffer(24);
        const movementArray = new Float32Array(movementBuffer);
        movementArray[0] = camera.position.x;
        movementArray[1] = camera.position.y;
        movementArray[2] = camera.position.z;
        movementArray[3] = camera.rotation.x;
        movementArray[4] = camera.rotation.y;
        movementArray[5] = camera.rotation.z;
        peers[p].movementChannel.send(movementBuffer);
    });
}

function setControl() {
    if(keyControls['w']) {
        pointerLockControls.moveForward(.1);
        sendMovementToPeers();
    }
    if(keyControls['s']) {
        pointerLockControls.moveForward(-.1);
        sendMovementToPeers();
    }
    if(keyControls['a']) {
        pointerLockControls.moveRight(-.1);
        sendMovementToPeers();
    }
    if(keyControls['d']) {
        pointerLockControls.moveRight(.1);
        sendMovementToPeers();
    }
}

function render() {
    renderer.render(scene, camera);
    setControl();
    requestAnimationFrame(render);
}

export {initRoom, scene};