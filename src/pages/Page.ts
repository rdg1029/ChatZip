class Page {
    divID: string;
    style: HTMLLinkElement;
    css: string;
    constructor(divID: string, css: string) {
        this.divID = divID;
        this.style = document.getElementById('style') as HTMLLinkElement;
        this.css = css;
    }
    setPage(html: string) {
        document.body.innerHTML = html;
        this.style.href = this.css;
    }
    removePage() {
        document.getElementById(this.divID).remove();
    }
}

export {Page};