"use strict";

class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        //create the ele
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        //console.log(this.text);
        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>
            <button class = "TextMessage_button">Next</button>
        `);


        //init type writer effect
        this.reavealingText = new RevealText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text,
        })

        this.element.querySelector("button").addEventListener("click", () => {
            this.done();
        });

        this.actionListener = new KeyPressListener("Enter", () => {
            //console.log("Enter when text message");
            this.done();
        })
    }

    done() {
        if (this.reavealingText.isDone) {
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        }else{
            this.reavealingText.warpToDone();
        }
    }

    init(container) {
        //console.log("Text message init");
        this.createElement();
        container.appendChild(this.element);
        this.reavealingText.init();
    }
}