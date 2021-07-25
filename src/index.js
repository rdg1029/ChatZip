import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility.js';
import { setPage } from './page.js';

const compatibilityCheckResult = compatibilityCheck();
if(compatibilityCheckResult == 'done') {
    setPage('main');
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}