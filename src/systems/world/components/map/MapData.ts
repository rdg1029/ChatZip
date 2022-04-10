interface MapData {
    spawnPoint: Array<number>;
};
let mapData: MapData;
function setMapData(uInt8Arr: Uint8Array) {
    const CONVERSION = 128;
    let data = "";
    for (let i = 0, j = uInt8Arr.length; i < j; i++) {
        data += String.fromCharCode(uInt8Arr[i] - CONVERSION);
    }
    mapData = JSON.parse(data);
}

export {mapData, setMapData};