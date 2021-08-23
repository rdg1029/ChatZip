import adapter from 'webrtc-adapter';
import { compatibilityCheck } from './compatibility.js';
//import { setPage } from './page.js';
import { Main } from './pages/Main.js';

const compatibilityCheckResult = compatibilityCheck();
if(compatibilityCheckResult == 'done') {
    main();
}
else {
    document.body.innerHTML = compatibilityCheckResult;
}

function main() {
    const mainPage = new Main('main', '../dist/css/main.css');
    mainPage.setPage();
}
