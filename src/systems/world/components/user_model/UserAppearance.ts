import { Texture, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, NearestFilter, Vector3 } from 'three';

class UserAppearance extends Mesh {
    private map: Texture;

    constructor() {
        const map = new TextureLoader().load('./img/mario.png');
        map.magFilter = NearestFilter;
        const plane = new PlaneGeometry(16, 16);
        const material = new MeshBasicMaterial({map: map, alphaTest: 0.5});
        super(plane, material);
        this.map = map;
    }
    updateRotationPoint() {
        const geometry = this.geometry;
        const center = new Vector3();

        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(center);
        geometry.center();
        this.position.copy(center);
        this.position.y += 8;
    }
    dispose() {
        this.map.dispose();
        this.geometry.dispose();
    }
}

export {UserAppearance};
