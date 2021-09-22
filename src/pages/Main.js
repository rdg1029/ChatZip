import {Page} from './Page.js';

class Main extends Page {
    constructor(divID, css) {
        super(divID, css);
        this.html = `
            <div id="main">
                <h1>찻집</h1>
                <div id="signage">
                    <img src="./img/signage.svg">
                    <div class="contents" id="contents-main">
                        <p id="open-status">준비 중</p>
                        <button class="btn" id="create-group">방 생성</button>
                        <button class="btn" id="enter-group">방 입장</button>
                    </div>
                    <div class="contents" id="contents-enter">
                        <input id="type-group-id" type="text" />
                        <br>
                        <button class="btn" id="enter">입장</button>
                        <br>
                        <button class="btn" id="back">뒤로 가기</button>
                    </div>
                </div>
            </div>
        `;
    }
    setPage() {
        super.setPage(this.html);

        this.mainSignage = document.getElementById('contents-main');
        this.openStatus = document.getElementById('open-status');
        this.createGroupButton = document.getElementById('create-group');
        this.enterGroupButton = document.getElementById('enter-group');

        this.enterSignage = document.getElementById('contents-enter');
        this.typeGroupId = document.getElementById('type-group-id');
        this.enterButton = document.getElementById('enter');
        this.backButton = document.getElementById('back');

        this.createGroupButton.disabled = true;
        this.enterGroupButton.disabled = true;
        this.enterSignage.style.display = 'none';
    }
}

export {Main};
