/**
 * Created by dmitrii on 5.12.18.
 */
export default class Api {
    constructor(url) {
        this.request = new XMLHttpRequest();
        this.url = url;
    }
    asGet() {
        this.method = "GET";
        return this;
    }
    asPut() {
        this.method = "PUT";
        return this;
    }
    asDelete() {
        this.method = "DELETE";
        return this;
    }
    asMKCOL() {
        this.method = "MKCOL";
        return this;
    }
    send(data) {
        this.request.open(this.method, this.url, true);
        return new Promise((resolve, reject) => {
            this.request.addEventListener("load", () => {
                if (this.request.status < 400){
                    resolve(this.request);
                } else {
                    reject(this.request);
                }
            });
            this.request.send(data);
        });
    }

}