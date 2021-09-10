import { Clock } from 'three/build/three.min';

class Loop {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.updateList = [];
    }
    start() {
        const clock = new Clock();
        const tickTime = 0.1;
        let duration = 0;

        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
            if (duration >= tickTime) {
                console.log('tick updated');
                duration = 0;
                return;
            }
            duration += clock.getDelta();
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    tick() {
        for (let i = 0, j = this.updateList.length; i < j; i++) {
            this.updateList[i].tick();
        }
    }
}

export {Loop};
