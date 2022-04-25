import { Clock, WebGLRenderer, Scene } from 'three';
import { Camera } from './components/Camera';
import { Tick } from './Tick';
import { user } from '../User';

class Loop {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    tick: Tick;
    state: HTMLDivElement;
    updateList: Array<any>;

    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.tick = new Tick();
        this.state = document.getElementById('state') as HTMLDivElement;
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
        const userState = user.state;
        this.state.innerText = `
            pos:${userState.pos[0].toFixed(3)} ${userState.pos[1].toFixed(3)} ${userState.pos[2].toFixed(3)}
            velocity:${userState.velocity[0].toFixed(3)} ${userState.velocity[1].toFixed(3)} ${userState.velocity[2].toFixed(3)}
            onGround:${userState.onGround}
            gravAccel:${userState.gravAccel.toFixed(3)}
        `;
    }
}

export {Loop};
