import * as THREE from 'three';
import { voxelData, getRGB } from './VoxelData';

const neighborOffsets = [
    [0, 0, 0], // self
    [-1, 0, 0], // left
    [1, 0, 0], // right
    [0, -1, 0], // bottom
    [0, 1, 0], // top
    [0, 0, -1], // back
    [0, 0, 1], // forward
];
const meshOfChunks = new Map();

class VoxelMap {
    constructor(scene, chunkSize) {
        this.scene = scene;
        this.chunkSize = chunkSize;
        this.chunkSizeBit = Math.log2(chunkSize);
        this.chunkSliceSize = chunkSize << this.chunkSizeBit;
        this.chunkSliceSizeBit = Math.log2(this.chunkSliceSize);
        this.chunks = new Map();
        this.faces = [
            { // left
                dir: [-1, 0, 0],
                corners: [
                    [0, 1, 0],
                    [0, 0, 0],
                    [0, 1, 1],
                    [0, 0, 1],
                ],
            },
            { // right
                dir: [1, 0, 0],
                corners: [
                    [1, 1, 1],
                    [1, 0, 1],
                    [1, 1, 0],
                    [1, 0, 0],
                ],
            },
            { // bottom
                dir: [0, -1, 0],
                corners: [
                    [1, 0, 1],
                    [0, 0, 1],
                    [1, 0, 0],
                    [0, 0, 0],
                ],
            },
            { // top
                dir: [0, 1, 0],
                corners: [
                    [0, 1, 1],
                    [1, 1, 1],
                    [0, 1, 0],
                    [1, 1, 0],
                ],
            },
            { // back
                dir: [0, 0, -1],
                corners: [
                    [1, 0, 0],
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ],
            },
            { // forward
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
    computeChunkId(x, y, z) {
        const { chunkSizeBit } = this;
        const chunkX = x >> chunkSizeBit;
        const chunkY = y >> chunkSizeBit;
        const chunkZ = z >> chunkSizeBit;
        return `${chunkX},${chunkY},${chunkZ}`;
    }
    getChunkForVoxel(x, y, z) {
        return this.chunks.get(this.computeChunkId(x, y, z));
    }
    computeVoxelOffset(x, y, z) {
        const { chunkSize, chunkSizeBit, chunkSliceSizeBit } = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, chunkSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, chunkSize) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, chunkSize) | 0;
        return (voxelY << chunkSliceSizeBit) + (voxelZ << chunkSizeBit) + voxelX;
    }
    getVoxel(x, y, z) {
        const chunk = this.getChunkForVoxel(x, y, z);
        if (!chunk) return 0;
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return chunk[voxelOffset];
    }
    generateGeometryData(chunkX, chunkY, chunkZ) {
        const { chunkSize, chunkSizeBit } = this;

        //BufferAttribute for BufferGeometry
        const positions = []; // vertex position data
        const normals = [];
        const colors = []; // (r, g, b)
        const index = []; // vertext positions array

        // Start positions of chunk
        const startX = chunkX << chunkSizeBit;
        const startY = chunkY << chunkSizeBit;
        const startZ = chunkZ << chunkSizeBit;

        for(let y = 0; y < chunkSize; ++y) {
            const voxelY = startY + y;
            for(let z = 0; z < chunkSize; ++z) {
                const voxelZ = startZ + z;
                for(let x = 0; x < chunkSize; ++x) {
                    const voxelX = startX + x;

                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        for (const { dir, corners } of this.faces) {
                            const neihbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2]);
                            if (!neihbor) {
                                const ndx = positions.length / 3;
                                for (const pos of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...dir);
                                    colors.push(...getRGB(voxelData[voxel]));
                                }
                                index.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
                            }
                        }
                    }
                }
            }
        }
        return {positions, normals, colors, index};
    }
    updateVoxelGeometry(x, y, z) {
        const updatedChunkIds = new Map();
        neighborOffsets.forEach(offset => {
            const offsetX = x + offset[0];
            const offsetY = y + offset[1];
            const offsetZ = z + offset[2];
            const chunkId = this.computeChunkId(offsetX, offsetY, offsetZ);
            if (!updatedChunkIds.get(chunkId)) {
                updatedChunkIds.set(chunkId, true);
                this.updateChunkGeometry(offsetX, offsetY, offsetZ);
            }
        });
    }
    updateChunkGeometry(x, y, z) {
        const chunkX = x >> CHUNK_SIZE_BIT;
        const chunkY = y >> CHUNK_SIZE_BIT;
        const chunkZ = z >> CHUNK_SIZE_BIT;
        const chunkId = this.computeChunkId(x, y, z);
        let mesh = meshOfChunks.get(chunkId);
        const geometry = mesh ? mesh.geometry : new THREE.BufferGeometry();
    
        const { positions, normals, colors, index } = this.generateGeometryData(chunkX, chunkY, chunkZ);
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const colorNumComponents = 3;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
        );
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
        );
        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(new Float32Array(colors), colorNumComponents)
        );
        geometry.setIndex(index);
        geometry.computeBoundingSphere();
        // If chunk is empty
        if (index.length === 0) {
            this.chunks.delete(chunkId);
            meshOfChunks.delete(chunkId);
            geometry.dispose();
            return;
        }
        if (!mesh) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.name = chunkId;
            meshOfChunks.set(chunkId, mesh);
            this.scene.add(mesh);
            mesh.position.set(chunkX << CHUNK_SIZE_BIT, chunkY << CHUNK_SIZE_BIT, chunkZ << CHUNK_SIZE_BIT);
        }
    }
}

export {VoxelMap};