const createRoom = document.getElementById('create-room');
const enterRoom = document.getElementById('enter-room');

function alertNotReady() {
    window.alert('준비중입니다');
}

createRoom.onclick = alertNotReady;
enterRoom.onclick = alertNotReady;