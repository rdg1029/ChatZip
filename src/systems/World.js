import { createRenderer } from './Renderer';

import { createScene } from '../components/Scene';
import { createCamera } from '../components/Camera';

class World {
    constructor(canvas) {
        this.renderer = createRenderer(canvas);
        this.scene = createScene();
        this.camera = createCamera();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
