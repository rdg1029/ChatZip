import { WebGLRenderer } from "three/build/three.min";

function createRenderer(canvas) {
    const renderer = new WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    return renderer;
}

export {createRenderer};