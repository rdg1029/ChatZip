import { CanvasTexture, SpriteMaterial, Sprite, LinearFilter, ClampToEdgeWrapping } from 'three/build/three.min';

function makeLabelCanvas(name) {
    const baseWidth = 75;
    const borderSize = 1;
    const fontSize = 16;
    const font = `${fontSize}px bold sans-serif`;
    const context = document.createElement('canvas').getContext('2d');
    context.font = font;
    const nameWidth = context.measureText(name).width;

    const doubleBorderSize = borderSize * 2;
    const width = nameWidth + doubleBorderSize;
    const height = fontSize + doubleBorderSize;

    context.canvas.width = width;
    context.canvas.height= height;

    context.font = font;
    context.textBaseLine = 'middle';
    context.textAlign = 'center';
    context.fillStyle = '#00000060';
    context.fillRect(0, 0, width, height);

    const scaleFactor = Math.min(1, baseWidth / nameWidth);
    context.translate(width / 2, height / 2);
    context.scale(scaleFactor, 1);
    context.fillStyle = 'white';
    context.fillText(name, 0, fontSize / 4);

    return context.canvas;
}

class NameLabel extends Sprite {
    constructor(name) {
        const canvas = makeLabelCanvas(name);
        const map = new CanvasTexture(canvas);
        map.minFilter = LinearFilter;
        map.wrapS = ClampToEdgeWrapping;
        map.wrapT = ClampToEdgeWrapping;
        const material = new SpriteMaterial({
            map: map,
            transparent: true
        });

        super(material);
        this.map = map;
        this.material = material;
        this.scale.x = canvas.width * 0.01;
        this.scale.y = canvas.height * 0.01;
        this.position.y = 0.75;
    }
    dispose() {
        this.map.dispose();
        this.material.dispose();
    }
}

export {NameLabel};
