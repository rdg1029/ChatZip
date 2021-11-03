import { createRenderer } from './Renderer';
import { Loop } from './Loop';

import { createScene } from './components/Scene';
import { createCamera } from './components/Camera';
import { createSkybox } from './components/Skybox';
import { createPlane } from './components/Plane';
import { UserModel } from './components/UserModel';

class World {
    constructor(canvas) {
        this.renderer = createRenderer(canvas);
        this.scene = createScene();
        this.camera = createCamera();
        this.loop = new Loop(this.renderer, this.scene, this.camera);

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });

        const skybox = createSkybox();
        this.scene.background = skybox;

        const plane = createPlane();
        plane.rotation.x = Math.PI * -.5;

        this.scene.add(plane);
    }
    createUserModel() {
        return new UserModel()
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
}

export {World};