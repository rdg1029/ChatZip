interface MapData {
    spawnPoint: Array<number>;
};
function setMapData(uInt8Arr: Uint8Array) {
    return new Promise(resolve => {
        const CONVERSION = 128;
        let data = "";
        for (let i = 0, j = uInt8Arr.length; i < j; i++) {
            data += String.fromCharCode(uInt8Arr[i] - CONVERSION);
        }
        resolve(JSON.parse(data));
    });
}

export {MapData, setMapData};