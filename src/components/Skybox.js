import { CubeTextureLoader } from "three/build/three.min";

function createSkybox() {
    const textureLoader = new CubeTextureLoader();
    const texture = textureLoader.load([
        './img/skybox/px.bmp',
        './img/skybox/nx.bmp',
        './img/skybox/py.bmp',
        './img/skybox/ny.bmp',
        './img/skybox/pz.bmp',
        './img/skybox/nz.bmp'
    ]);

    return texture;
}

export {createSkybox};
