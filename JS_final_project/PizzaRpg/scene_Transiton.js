"use strict";

class SceneTransition {
    constructor() {
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
    }

    fadeOut(){
        this.element.classList.add("fade-out");
        this.element.addEventListener("onanimationend", () => {
            this.element.remove();
        }, { once: true }) //immediateley unbind when done
    }

    init(container, callback) {
        this.createElement();
        container.appendChild(this.element);

        this.element.addEventListener("animationend", () => {
            callback();
        }, { once: true }) //immediateley unbind when done
    }
}