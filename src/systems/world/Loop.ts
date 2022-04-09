import { Clock, WebGLRenderer, Scene } from 'three';
import { Camera } from './components/Camera';
import { Tick } from './Tick';

class Loop {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    tick: Tick;
    updateList: Array<any>;

    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.tick = new Tick();
        this.updateList = [];
    }
    start() {
        const clock = new Clock();
        const tickTime = 0.1;
        let duration = 0;

        this.renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            this.update(delta);
            this.camera.updatePosition();
            this.renderer.render(this.scene, this.camera);
            duration += delta;
            if (duration < tickTime) return;
            this.tick.update();
            duration = 0;
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    update(delta: number) {
        for (let i = 0, j = this.updateList.length; i < j; i++) {
            this.updateList[i].update(delta);
        }
    }
}

export {Loop};
