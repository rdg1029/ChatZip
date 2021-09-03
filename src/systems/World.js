import { createRenderer } from './Renderer';
import { Loop } from './Loop';

import { createScene } from '../components/Scene';
import { createCamera } from '../components/Camera';

class World {
    constructor(canvas) {
        this.renderer = createRenderer(canvas);
        this.scene = createScene();
        this.camera = createCamera();
        this.loop = new Loop(this.renderer, this.scene, this.camera);
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
}
