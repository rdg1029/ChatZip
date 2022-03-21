import { WebGLRenderer } from "three";

function createRenderer(canvas) {
    const renderer = new WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    return renderer;
}

export {createRenderer};