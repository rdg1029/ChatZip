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
    addElement(parentElemId, Elem) {
        if(parentElemId === 'body') {
            document.body.appendChild(Elem);
        }
        else {
            const parentElem = document.getElementById(parentElemId);
            parentElem.appendChild(Elem);
        }
    }
    removeElement(id) {
        document.getElementById(id).remove();
    }
}

export {Page};
