import {WEBGL} from 'three/examples/jsm/WebGL'

function compatibilityCheck() {
    let result = '';
    if(!WEBGL.isWebGLAvailable) {
        result += 'WebGL is not supported<br>';
    }
    if(navigator.getUserMedia && window.RTCPeerConnection) {
        result += 'WebRTC is not supported';
    }

    if(result == '') {
        return 'done'
    }
    else {
        return result;
    }
}

export {compatibilityCheck};