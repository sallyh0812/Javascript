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

        if(submission.replacement){
            await this.onNewEvent({
                type: "replace", 
                replacement: submission.replacement,
            });

            await this.onNewEvent({
                type: "textMessage", 
                text: `Go get them, ${submission.replacement.name}!`,
            });
            this.nextTurn();
        }

        console.log("submission from turnCycle.js:",submission);
        if(submission.instanceId){
            //delete the item with the instanceId
            this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId);
        }

        const resultingEvent = submission.action.success; //caster.getReplacedEvents(submission.action.success);
        /*success: [
            {type: "textMessage", text: "{Pizza} uses Whomp!"},
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
            // console.log(`event.caster,enemy.name from turnCycle: ${event.caster.name},${event.target.name}`);
            await this.onNewEvent(event);
        }

        //sb die?
        const targetDie = submission.target.hp <=0;
        if(targetDie){
            await this.onNewEvent(
                {type: "textMessage", text: `${submission.target.name} is ruined...`},
            )
        }
        //winning team? end battle
        const winner = this.getWinner();
        if(winner){
            await this.onNewEvent({
                type: "textMessage", 
                text: "Hurray! You saved the pizza world!",
            });
            return;
        }

        //bring replacement if no winning team
        if(targetDie){
            const replacement = await this.onNewEvent({
                type: "replacementMenu",
                team: submission.target.team,
            });

            await this.onNewEvent({
                type: "replace", 
                replacement: replacement,
            });

            await this.onNewEvent({
                type: "textMessage", 
                text: `${replacement.name} comes!`,
            });
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

        //
        const casterDie = caster.hp >=0;

        //check for status expire
        const expiredEvent = caster.decrementStatus();
        if(expiredEvent){
            await this.onNewEvent(expiredEvent);
        }

        this.nextTurn();
    }

    nextTurn(){
        this.currentTeam = this.currentTeam === "player" ? "enemy": "player";
        this.turn();
    }

    getWinner(){
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach(cmbt =>{
            if(cmbt.hp>0){
                aliveTeams[cmbt.team] = true;
            }
        });
        if(!aliveTeams["player"]) {return "enemy"};
        if(!aliveTeams["enemy"]) {return "player"};
        return null;
    }

    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "Battle starts!",
        });

        //start the first turn
        this.turn();
    }
}