import { WebGLRenderer, Scene } from 'three';

import { createRenderer } from './Renderer';
import { Loop } from './Loop';

import { createScene } from './components/Scene';
import { createCamera, Camera } from './components/Camera';
import { createSkybox } from './components/Skybox';
import { createLight } from './components/Light';
// import { createPlane } from './components/Plane';
import { UserModel } from './components/user_model/UserModel';
import { VoxelMap } from './components/map/VoxelMap';

class World {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: Camera;
    public loop: Loop;
    public map: VoxelMap;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = createRenderer(canvas);
        this.scene = createScene();
        this.camera = createCamera();
        this.loop = new Loop(this.renderer, this.scene, this.camera);
        this.map = new VoxelMap(this.scene);

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });

        const skybox = createSkybox();
        this.scene.background = skybox;

        const light = createLight();
        this.scene.add(light);
    }
    createUserModel(name: string) {
        return new UserModel(name, this.camera);
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
}

export {World};
