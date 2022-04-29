import { Texture, TextureLoader, SpriteMaterial, Sprite, NearestFilter } from 'three';

class UserAppearance extends Sprite {
    map: Texture;

    constructor() {
        const map = new TextureLoader().load('./img/mario.png');
        map.magFilter = NearestFilter;
        const material = new SpriteMaterial({map: map});
        super(material);
        this.position.y = 8;
        this.scale.set(16, 16, 16);
        this.map = map;
        this.material = material;
    }
    dispose() {
        this.map.dispose();
        this.material.dispose();
    }
}

export {UserAppearance};
