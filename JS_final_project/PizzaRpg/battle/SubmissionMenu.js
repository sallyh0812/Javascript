"use strict";

class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
        let itemQuantityMap = {};
        items.forEach(item => {
            if (item.team === caster.team) {
                let ext = itemQuantityMap[item.actionId];
                if (ext) {
                    ext.quantity += 1;
                } else {
                    itemQuantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId: item.instanceId,
                    }
                }
            }
        });
        console.log(itemQuantityMap);
        this.items = Object.values(itemQuantityMap);
        console.log(this.items);
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
                //items
                ...this.items.map(item => {
                    const action = Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: ()=>{
                            return `x${item.quantity}`;
                        },
                        handler: () => {
                            this.menuSubmit(action, item.instanceId);
                        }
                    }
                }),
                backOption
            ]
        }
    }

    menuSubmit(action, instanceId = null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action: action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId,
        });
        /*  from battle_event.js -> submissionMenu(resolve)
            onComplete: submission => {
                resolve(submission);
            } */
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
        //console.log(`this.getPages.root[0].label: ${this.getPages().root[0].label}`);
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