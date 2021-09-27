import { Clock } from 'three/build/three.min';
import { Tick } from './Tick';

class Loop {
    constructor(renderer, scene, camera) {
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
            this.renderer.render(this.scene, this.camera);
            if (!this.tick.isStandard) return;
            duration += delta;
            if (duration < tickTime) return;
            this.tick.update();
            duration = 0;
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    update(delta) {
        for (let i = 0, j = this.updateList.length; i < j; i++) {
            this.updateList[i].update(delta);
        }
    }
}

export {Loop};
