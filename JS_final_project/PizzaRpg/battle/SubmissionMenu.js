"use strict";

class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    getPages() {

        const backOption = {
            label: "Go Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root);
            }
        };

        return {
            root: [
                {
                    label: "Attack",
                    description: "Choose and attack",
                    handler: () => {
                        //do sth when chosen
                        console.log("GO TO ATTACK PAGE");
                        this.keyboardMenu.setOptions(this.getPages().attacks);
                    },
                    right: () => {
                        return "";
                    }
                },
                {
                    label: "Items",
                    description: "Choose an item from your inventory",
                    disabled: false, //true
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().items);
                    }
                },
                {
                    label: "Swap",
                    description: "Change to other pizza",
                    handler: () => {

                    }
                }

            ],
            attacks: [
                // {
                //     label: "My first attack",
                //     description: "Does this...",
                //     handler: ()=>{

                //     }
                // },
                ...this.caster.actions.map(key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        }
                    }
                }),
                backOption
            ],
            items: [
                //
                backOption
            ]
        }
    }

    menuSubmit(action, instanceId = null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action: action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
        })
    }

    decide() {
        //TODO: enemies randomly choose what to do
        this.menuSubmit(Actions[utils.randomFromArray(this.caster.actions)]); //this.caster.actions[0]
        /*randomFromArray(arr){
        return arr[Math.floor(Math.random()*arr.length)];
    } */
    }

    showMenu(container) {
        console.log("showMenu");
        //console.log(`this.getPages.root: ${this.getPages().root}`);
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    init(container) {
        //console.log(this.caster.isPlayerControlled);
        if (this.caster.isPlayerControlled) {
            //show menu
            this.showMenu(container);

        } else {
            this.decide();
        }
    }
}