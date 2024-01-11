"use strict";

class TurnCycle {
    constructor({ battle, onNewEvent }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;

        /* from battle.js
            onNewEvent: event =>{
                return new Promise(resolve=>{
                const battleEvent = new BattleEvent(event, this);
                battleEvent.init(resolve);
            })
        }*/

        this.currentTeam = "player"; // enemy
    }

    async turn() {
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];
        //console.log(`enemy.name from turn(): ${enemy.name}`);

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster: caster,
            enemy: enemy,
        });

        const resultingEvent = submission.action.success; //caster.getReplacedEvents(submission.action.success);
        /*success: [
            {type: "textMessage", text: "{Pizza} uses Whomp!"},
            {type: "animation", animation: "toBeDefined"},
            {type: "textMessage", text: "Something happend!"},
            {type: "stateChange", damage: 10},
        ], */


        for (let i = 0; i < resultingEvent.length; i++) {
            const event = {
                ...resultingEvent[i],
                submission,
                action: submission.action,
                caster: caster,
                target: submission.target,
            }
            // console.log(`event.caster.name from turnCycle: ${event.caster.name}`);
            // console.log(`event.action.name from turnCycle: ${event.action.name}`);
            // console.log(`event.target.name from turnCycle: ${event.target.name}`);

            await this.onNewEvent(event);
        }

        
        //check for post event
        // do things after original turn submission
        const postEvents = caster.getPostEvents();
        for(let i = 0; i<postEvents.length; i++){
            const event = {
                ...postEvents[i],
                submission,
                action: submission.action,
                caster: caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //check for status expire
        const expiredEvent = caster.decrementStatus();
        if(expiredEvent){
            await this.onNewEvent(expiredEvent);
        }

        if(enemy.hp<=0){
            await this.onNewEvent({
                type: "textMessage",
                text: "Game over..."
            });
            if(enemy.team === "player"){
                await this.onNewEvent({
                    type: "textMessage",
                    text: "You lose the battle..."
                });
            }else{
                await this.onNewEvent({
                    type: "textMessage",
                    text: "You win the battle! Thanks for saving the pizza wonderland!"
                });
            }
            location.reload();
        }

        else if(caster.hp<=0){
            await this.onNewEvent({
                type: "textMessage",
                text: "Game over..."
            });
            if(caster.team === "player"){
                await this.onNewEvent({
                    type: "textMessage",
                    text: "You lose the battle..."
                });
            }else{
                await this.onNewEvent({
                    type: "textMessage",
                    text: "You win the battle! Thanks for saving the pizza wonderland!"
                });
            }
            location.reload();
        }

        this.currentTeam = this.currentTeam === "player" ? "enemy": "player";
        this.turn();

    }

    async init() {
        // await this.onNewEvent({
        //     type: "textMessage",
        //     text: "The battle is starting!",
        // });

        //start the first turn
        this.turn();
    }
}