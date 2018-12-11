/**
 * Created by dmitrii on 6.12.18.
 */
export default class notifications {
    constructor(parent) {
        this.parent = parent;
    }
    success(text) {
        this.color = "darkgreen";
        this.backgroundColor = "lightgreen";
        this.borderColor = "#d6e9c6";
        this.insert(text);
    }
    error(text) {
        this.color = "darkred";
        this.backgroundColor = "lightcoral";
        this.borderColor = "lightcoral";
        this.insert(text);
    }
    insert(text) {
        var div = document.createElement("div");
        var main = document.querySelector("#main");
        var styleMain = getComputedStyle(main);
        var closeIcon = document.createElement("i");
        closeIcon.className = "fa fa-times";
        closeIcon.style.position = "absolute";
        closeIcon.style.right = 5 + "px";
        closeIcon.style.top = 5 + "px";
        closeIcon.style.color = this.color;
        closeIcon.addEventListener("click", () => {
            this.deleteNotification(div);
            clearTimeout(timeOutId);
        });
        this.parent.insertBefore(div, main);
        div.innerText = text;
        div.style.position = "relative";
        div.style.padding = 15 + "px";
        div.style.marginBottom = 15 + "px";
        div.style.textAlign = "center";
        div.style.color = this.color;
        div.style.boxSizing = "border-box";
        div.style.border = "1px solid" + this.borderColor ;
        div.style.borderRadius = 4 +"px";
        div.style.width = styleMain.width;
        div.style.height = 50 + "px";
        div.style.backgroundColor = this.backgroundColor;
        div.appendChild(closeIcon);
        var timeOutId = setTimeout(() => this.deleteNotification(div), 10000);
    }
    deleteNotification(elem) {
        this.parent.removeChild(elem);
    }

}