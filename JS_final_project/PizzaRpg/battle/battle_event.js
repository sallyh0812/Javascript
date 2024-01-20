"use strict";

class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;

        /*  from battle.js
            onNewEvent: event =>{
                return new Promise(resolve=>{
                const battleEvent = new BattleEvent(event, this);
                battleEvent.init(resolve);
            }) */
        /* from turnCycle.js
            await this.onNewEvent({
                type: "textMessage",
                text: "The battle is starting!",
            }); */
        /* from turnCycle.js
            const event = {
                ...resultingEvent[i],
                submission,
                action: submission.action,
                caster: caster,
                target: submission.target,
            }
            await this.onNewEvent(event); */
    }

    textMessage(resolve) {
        const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{ACTION}", this.event.action?.name)

        //console.log("battle message");
        const message = new TextMessage({
            text: text,
            onComplete: () => resolve(),
        })
        message.init(this.battle.element);
    }

    submissionMenu(resolve) {
        //console.log("submission menu");
        const { caster } = this.event;
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            replacements: Object.values(this.battle.combatants).filter(cmbt => {
                return cmbt.id !== caster.id && cmbt.team === caster.team && cmbt.hp > 0;
            }),
            onComplete: submission => {
                //submission {what to use , who to use it on}
                resolve(submission);
            }
        });
        menu.init(this.battle.element);
    }

    replacementMenu(resolve) {
        //console.log("replacement menu");
        const menu = new ReplacementMenu({
            replacements: Object.values(this.battle.combatants).filter(cmbt => {
                return cmbt.team === this.event.team && cmbt.hp > 0;
            }),
            onComplete: replacement => {
                resolve(replacement);
            }
        });
        menu.init(this.battle.element);
    }

    async getXp(resolve) {
        const { combatant } = this.event;
        let getXp = this.event.xp;
        const step = () => {
            if (getXp > 0) {
                getXp -= 1;
                combatant.xp += 1;
                if (combatant.xp >= combatant.maxXp) {
                    combatant.level += 1;
                    combatant.xp = 0;
                    combatant.maxXp = 100; //for next level
                }

                combatant.update();
                requestAnimationFrame(step);
                return;
            }
            resolve();
        }
        requestAnimationFrame(step);
    }

    async replace(resolve) {
        //console.log("replace");
        const { replacement } = this.event;
        const prevCmbt = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        //console.log("prevCmbt:",prevCmbt);

        this.battle.activeCombatants[replacement.team] = null;
        this.battle.activeCombatants[replacement.team] = replacement.id;

        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        prevCmbt.update();
        await utils.wait(400);
        replacement.update();
        await utils.wait(400);

        resolve();
    }

    async stateChange(resolve) {
        const { caster, target, damage, recover, status, action } = this.event;
        let who = this.event.onCaster ? caster : target;
        let oppositeWho = this.event.onCaster ? target : caster;

        /*finished in SubmissionMenu.js menuSubmit
            if(action.targetType === "friendly"){
                who = caster;
         }*/

        if (damage && who.status?.type !== "cheesy") {
            if (oppositeWho.status?.type === "spicy") {
                //modify target to have less hp
                who.update({
                    hp: who.hp - Math.floor(damage*0.8),
                });
            }else if(oppositeWho.status?.type === "magic"){
                who.update({
                    hp: who.hp - Math.floor(damage*1.5),
                });
            } else {
                who.update({
                    hp: who.hp - damage,
                });
            }
            //start blinking
            //console.log(`who.name from battle_event stateChange ${who.name}`);
            who.pizzaElement.classList.add("battle-damage-blink");
        }

        if (recover) {
            who.hp = who.hp + recover > who.maxHp ? who.maxHp : who.hp + recover;
            who.update();
        }

        if (status) {
            if (who.status?.type === "cheesy") {
                let cheese = who.pizzaContainerElement.querySelector(".cheese");
                cheese.remove();
            }
            who.update({
                status: { ...status },
            });
        }

        if (status === null) {
            who.update({
                status: null,
            })
        }

        //wait
        await utils.wait(600);

        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        //stop blinking
        who.pizzaElement.classList.remove("battle-damage-blink");
        resolve();
    }

    animation(resolve) {
        const fn = BattleAnimatons[this.event.animation];
        fn(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}