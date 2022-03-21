import { TextureLoader, SpriteMaterial, Sprite } from 'three';

class UserAppearance extends Sprite {
    constructor() {
        const map = new TextureLoader().load('./img/person.png');
        const material = new SpriteMaterial({map: map});
        super(material);
        this.map = map;
        this.material = material;
    }
    dispose() {
        this.map.dispose();
        this.material.dispose();
    }
}

export {UserAppearance};