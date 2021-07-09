const style = document.getElementById('style');
let currentPage;

function setPage(page) {
    if(currentPage !== undefined) {
        document.getElementById(currentPage).remove();
    }
    currentPage = page;
    switch(page) {
        case 'main':
            document.body.innerHTML = '<div id="main"><h1>찻집</h1><div id="signage"><img src="img/signage.svg"><div id="contents-main"><p id="status">준비 중</p><button id="create-room">방 생성</button><button id="enter-room">방 입장</button></div></div></div>';
            style.href=('./css/main.css');
            break;
        case 'test':
            document.body.innerHTML = '<h1>TEST</h1>';
    }
}

export {setPage};