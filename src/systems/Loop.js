import { Clock } from 'three/build/three.min';

class Loop {
    constructor(renderer, scene, camera, tick) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.tick = tick;
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
            if (duration >= tickTime) {
                // const cameraPosDelta = this.camera.getPositionDelta();
                // const cameraRotDelta = this.camera.getRotationDelta();
                // console.log(`posX: ${cameraPosDelta.get('x')} / posY: ${cameraPosDelta.get('y')} / posZ: ${cameraPosDelta.get('z')} / rotX: ${cameraRotDelta.get('x')} / rotY: ${cameraRotDelta.get('y')} / rotZ: ${cameraRotDelta.get('z')}`);
                duration = 0;
                return;
            }
            duration += delta;
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
