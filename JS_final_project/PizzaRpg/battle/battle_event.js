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

        console.log("battle message");
        const message = new TextMessage({
            text: text,
            onComplete: () => resolve(),
        })
        message.init(this.battle.element);
    }

    submissionMenu(resolve) {
        console.log("submission menu");
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: submission => {
                //submission {what to use , who to use it on}
                resolve(submission);
            }
        });
        menu.init(this.battle.element);
    }

    async stateChange(resolve) {
        const { caster, target, damage, recover, status, action } = this.event;
        let who = this.event.onCaster ? caster : target;

        /*finished in SubmissionMenu.js menuSubmit
            if(action.targetType === "friendly"){
                who = caster;
         }*/

        if (damage) {
            //modify target to have less hp
            target.update({
                hp: target.hp -= damage,
            });

            //start blinking
            console.log(`target.name from battle_event stateChange ${target.name}`);
            target.pizzaElement.classList.add("battle-damage-blink");
        }

        if (recover) {
            who.hp = who.hp + recover > who.maxHp ? who.maxHp : who.hp + recover;
            who.update();
        }

        if (status) {
            who.update({
                status: { ...status },
            })
        }

        if (status === null) {
            who.update({
                status: null,
            })
        }

        //wait
        await utils.wait(600);

        //stop blinking
        target.pizzaElement.classList.remove("battle-damage-blink");

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