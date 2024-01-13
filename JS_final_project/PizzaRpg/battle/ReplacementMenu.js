"use strict";

class ReplacementMenu {
    constructor({ replacements, onComplete }) {
        this.replacements = replacements;
        this.onComplete = onComplete;
    }

    decide() {
        this.menuSubmit(utils.randomFromArray(this.replacements)); //this.caster.actions[0]
    }

    menuSubmit(replacement) {
        console.log("menuSubmit");
        this.keyboardMenu?.end();
        this.onComplete(
            replacement,
        );
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        console.log("this.replacements:", this.replacements);
        this.keyboardMenu.setOptions(this.replacements.map(cmbt => {
            return {
                label: cmbt.name,
                description: cmbt.description,
                handler: () => {
                    this.menuSubmit(cmbt);
                }
            }
        }));
    }

    init(container) {
        if(this.replacements[0].isPlayerControlled){
            this.showMenu(container);
        }else{
            this.decide();
        }
        
    }
}