class Page {
    constructor(divID, css) {
        this.divID = divID;
        this.style = document.getElementById('style');
        this.css = css;
    }
    setPage(html) {
        document.body.innerHTML = html;
        this.style.href = this.css;
    }
    removePage() {
        document.getElementById(this.divID).remove();
    }
}