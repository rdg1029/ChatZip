import { CubeTextureLoader } from "three/build/three.min";

function createSkybox() {
    const textureLoader = new CubeTextureLoader();
    const texture = textureLoader.load([
        '/dist/img/skybox/px.bmp',
        '/dist/img/skybox/nx.bmp',
        '/dist/img/skybox/py.bmp',
        '/dist/img/skybox/ny.bmp',
        '/dist/img/skybox/pz.bmp',
        '/dist/img/skybox/nz.bmp'
    ]);

    return texture;
}

export {createSkybox};
