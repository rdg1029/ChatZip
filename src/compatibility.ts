import WEBGL from 'three/examples/jsm/capabilities/WebGL'

function compatibilityCheck() {
    let result = '';
    if(!(WEBGL.isWebGLAvailable() || WEBGL.isWebGL2Available())) {
        result += 'WebGL is not supported<br>';
    }
    if(!(window.RTCPeerConnection)) {
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
