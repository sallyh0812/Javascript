"use strict";

class KeyboardMenu {
    constructor() {
        this.options = [];
        this.up = null;
        this.down = null;
        this.prevFocus = null;
    }

    setOptions(options) {
        //in SubmissionMenu.js -> this.keyboardMenu.setOptions(this.getPages().root);
        this.options = options;
        //console.log(`this.options:`, this.options);
        this.element.innerHTML = this.options.map((option, index) => {
            const disabledAttr = option.disabled ? "disabled" : "";
            return (`
                <div class="option">
                    <button ${disabledAttr} data-button="${index}"  data-description = "${option.description}">${option.label}</button>
                    <span class="right">${option.right ? option.right() : ""}</span>
                </div>
            `)
        }).join("");

        this.element.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                //console.log(btn.dataset.button); //the index
                const chosenOption = this.options[Number(btn.dataset.button)];
                chosenOption.handler();
            });
            btn.addEventListener("mouseenter", () => {
                btn.focus();
            });
            btn.addEventListener("focus", () => {
                this.prevFocus = btn;
                this.descriptionElementText.innerText = btn.dataset.description;
            })
        });

        setTimeout(()=>{
            this.element.querySelector("button[data-button]:not([disabled])").focus();
        },10);

    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("keyboard_menu");

        //description box
        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("description_box")
        this.descriptionElement.innerHTML = (`<p>ppp</p>`);
        this.descriptionElementText = this.descriptionElement.querySelector("p");
    }

    end(){
        this.element.remove();
        this.descriptionElement.remove();

        this.up.unbind();
        this.down.unbind();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.descriptionElement);
        container.appendChild(this.element);

        this.up = new KeyPressListener("ArrowUp",()=>{
            const current = Number(this.prevFocus.dataset.button); /*.getAttribute("data-button")*/
            //console.log(current);
            const prevBtn = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(ele=>{
                return ele.dataset.button < current && !ele.disabled;
            });
            prevBtn?.focus();
        });
        
        this.down = new KeyPressListener("ArrowDown",()=>{
            const current = Number(this.prevFocus.dataset.button); /*.getAttribute("data-button")*/
            //console.log(current);
            const nextBtn = Array.from(this.element.querySelectorAll("button[data-button]")).find(ele=>{
                return ele.dataset.button > current && !ele.disabled;
            });
            nextBtn?.focus();
        });
    }
}