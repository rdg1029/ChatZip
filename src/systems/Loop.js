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
        const oldLoc = new Map([
            ['posX', 0],
            ['posY', 0],
            ['posZ', 0],
            ['rotX', 0],
            ['rotY', 0],
            ['rotZ', 0],
            ['first', true]
        ]);

        this.renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            this.tick(delta);
            this.renderer.render(this.scene, this.camera);
            if (oldLoc.get('first')) {
                oldLoc.set('posX', this.camera.position.x);
                oldLoc.set('posY', this.camera.position.y);
                oldLoc.set('posZ', this.camera.position.z);
                oldLoc.set('first', false);
            }
            if (duration >= tickTime) {
                console.log(`<Speed> x: ${this.camera.position.x - oldLoc.get('posX')}/y: ${this.camera.position.y - oldLoc.get('posY')}/z: ${this.camera.position.z - oldLoc.get('posZ')}`);
                oldLoc.set('posX', this.camera.position.x);
                oldLoc.set('posY', this.camera.position.y);
                oldLoc.set('posZ', this.camera.position.z);
                duration = 0;
                return;
            }
            duration += delta;
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    tick(delta) {
        for (let i = 0, j = this.updateList.length; i < j; i++) {
            this.updateList[i].tick(delta);
        }
    }
}

export {Loop};
