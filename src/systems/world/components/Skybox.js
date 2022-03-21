import { CubeTextureLoader } from "three";

function createSkybox() {
    const textureLoader = new CubeTextureLoader();
    const texture = textureLoader.load([
        './img/skybox/px.png',
        './img/skybox/nx.png',
        './img/skybox/py.png',
        './img/skybox/ny.png',
        './img/skybox/pz.png',
        './img/skybox/nz.png'
    ]);

    return texture;
}

export {createSkybox};
