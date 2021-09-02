import { WebGLRenderer } from "three/build/three.min";

function createRenderer(canvas) {
    return new WebGLRenderer({canvas});
}

export {createRenderer};