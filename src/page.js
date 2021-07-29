import { initMain } from "./main";
import { initChat } from "./chat";
import { initRoom } from "./room";

let currentPage;

function setPage(page) {
    const style = document.getElementById('style');
    if(currentPage !== undefined) {
        document.getElementById(currentPage).remove();
    }
    currentPage = page;
    switch(page) {
        case 'main':
            document.body.innerHTML = '<div id="main"><h1>찻집</h1><div id="signage"><img src="../../dist/img/signage.svg"><div class="contents"id="contents-main"><p id="status">CLOSED<br>(준비중)</p><button class="btn"id="create-group">방 생성</button><button class="btn"id="enter-group">방 입장</button></div><div class="contents"id="contents-enter"><input id="type-group-id"type="text"/><br><button class="btn"id="enter">입장</button><br><button class="btn"id="back">뒤로 가기</button></div></div></div>';
            style.href = './css/main.css';
            initMain();
            break;
        case 'room':
            document.body.innerHTML = '<canvas id="c"></canvas><div id="chat"><ul id="messages"></ul><form id="form"><input id="input" /></form></div>';
            style.href = './css/room.css';
            initChat();
            initRoom();
            break;
    }
}

export {setPage};