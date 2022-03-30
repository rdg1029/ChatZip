import * as THREE from 'three';

class VoxelMap {
    constructor(chunkSize) {
        this.chunkSize = chunkSize;
        this.chunkSizeBit = Math.log2(chunkSize);
        this.chunkSliceSize = chunkSize << this.chunkSizeBit;
        this.chunkSliceSizeBit = Math.log2(this.chunkSliceSize);
        // this.chunk = new Uint8Array(chunkSize * chunkSize * chunkSize);
        this.chunks = new Map();
        this.faces = [
            { //left
                dir: [-1, 0, 0],
                //정육면체를 정면으로 봤을 때, 맨 앞쪽 면에서 왼쪽 아래 꼭짓점 => (0, 0, 0)
                corners: [
                    [0, 1, 0],
                    [0, 0, 0],
                    [0, 1, 1],
                    [0, 0, 1],
                ],
            },
            { //right
                dir: [1, 0, 0],
                corners: [
                    [1, 1, 1],
                    [1, 0, 1],
                    [1, 1, 0],
                    [1, 0, 0],
                ],
            },
            { //down
                dir: [0, -1, 0],
                corners: [
                    [1, 0, 1],
                    [0, 0, 1],
                    [1, 0, 0],
                    [0, 0, 0],
                ],
            },
            { //up
                dir: [0, 1, 0],
                corners: [
                    [0, 1, 1],
                    [1, 1, 1],
                    [0, 1, 0],
                    [1, 1, 0],
                ],
            },
            { //back
                dir: [0, 0, -1],
                corners: [
                    [1, 0, 0],
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ],
            },
            { //front
                dir: [0, 0, 1],
                corners: [
                    [0, 0, 1],
                    [1, 0, 1],
                    [0, 1, 1],
                    [1, 1, 1],
                ],
            },
        ]
    }    
}

export {VoxelMap};