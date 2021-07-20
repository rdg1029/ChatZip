import { initMain } from "./main";
import { initChat } from "./chat";

const style = document.getElementById('style');
let currentPage;

function setPage(page) {
    if(currentPage !== undefined) {
        document.getElementById(currentPage).remove();
    }
    currentPage = page;
    switch(page) {
        case 'main':
            document.body.innerHTML = '<div id="main"><h1>찻집</h1><div id="signage"><img src="img/signage.svg"><div id="contents-main"><p id="status">준비 중</p><button id="create-group">방 생성</button><button id="enter-group">방 입장</button></div></div></div>';
            style.href = './css/main.css';
            initMain();
            break;
        case 'chat':
            document.body.innerHTML = '<div id="chat"><ul id="messages"></ul><form id="form"><input id="input" /></form></div>';
            style.href = './css/chat.css';
            initChat();
            break;
    }
}

export {setPage};