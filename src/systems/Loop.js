class Loop {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.updateList = [];
    }
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
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
