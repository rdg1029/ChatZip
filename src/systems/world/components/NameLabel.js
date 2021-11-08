import { CanvasTexture, SpriteMaterial, Sprite } from 'three/build/three.min';

function makeLabelCanvas(name) {
    const baseWidth = 150;
    const borderSize = 2;
    const fontSize = 32;
    const font = `${fontSize}px bold sans-serif`;
    const context = document.createElement('canvas').getContext('2d');
    context.font = font;
    const nameWidth = context.measureText(name).width;

    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = fontSize + doubleBorderSize;

    context.canvas.width = width;
    context.canvas.height= height;

    context.font = font;
    context.textBaseLine = 'middle';
    context.textAlign = 'center';
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const scaleFactor = Math.min(1, baseWidth / nameWidth);
    context.translate(width / 2, height / 2);
    context.scale(scaleFactor, 1);
    context.fillStyle = 'white';
    context.fillText(name, 0, 0);

    return context.canvas;
}
