"use strict";

class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items, replacements }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;

        this.replacements = replacements;
        /* from battle_event -> submissionMenu(resolve)
            replacements: Object.values(this.battle.combatants).filter(cmbt=>{
                return cmbt.id !== caster.id && cmbt.team === caster.team && cmbt.hp>0;
            }), */
        //console.log("this.replacements:",this.replacements);
        
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
                        itemId: item.itemId,
                    }
                }
            }
        });
        this.items = Object.values(itemQuantityMap);
        //console.log(this.items);
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
                        //console.log("GO TO ATTACK PAGE");
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
                        this.keyboardMenu.setOptions(this.getPages().replacements);
                    }
                }

            ],
            attacks: [
                ...this.caster.actions.map(key => {
                    const action = window.Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        disabled: action.alwaysAvailable? false : utils.randomFromArray([true,false]),
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
                    const action = window.Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: ()=>{
                            return `x${item.quantity}`;
                        },
                        handler: () => {
                            this.menuSubmit(action, item.itemId);
                        }
                    }
                }),
                backOption
            ],
            replacements: [
                ...this.replacements.map(replacement => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                            this.menuSubmitReplacement(replacement);
                        }
                    }
                }),
                backOption
            ]
        }
    }

    menuSubmitReplacement(replacement){
        //console.log("menuSubmitReplacement");
        this.keyboardMenu?.end();
        this.onComplete({
            replacement,
        })
    }

    menuSubmit(action, itemId = null) {
        //console.log("menuSubmit");
        this.keyboardMenu?.end();
        this.onComplete({
            action: action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            itemId,
        });
        /*  from battle_event.js -> submissionMenu(resolve)
            onComplete: submission => {
                resolve(submission);
            } */
    }

    decide() {
        this.menuSubmit(Actions[utils.randomFromArray(this.caster.actions)]); //this.caster.actions[0]
    }

    showMenu(container) {
        //console.log("showMenu");
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