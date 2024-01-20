"use strict";

class TurnCycle {
    constructor({ battle, onNewEvent, onWinner }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        /* from battle.js
            onNewEvent: event =>{
                return new Promise(resolve=>{
                const battleEvent = new BattleEvent(event, this);
                battleEvent.init(resolve);
            })
        }*/

        this.onWinner = onWinner;
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

        if (submission.replacement) {
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

        //console.log("submission from turnCycle.js:", submission);
        if (submission.itemId) {
            //pass the usage status to playerstate
            this.battle.usedItemIds[submission.itemId] = true;
            
            //delete the item with the itemId
            this.battle.items = this.battle.items.filter(i => i.itemId !== submission.itemId);
        }

        const resultingEvent = enemy.getReplacedEvents(submission.action); //submission.action.success;

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

        //target die?
        const targetDie = submission.target.hp <= 0;
        if (targetDie) {
            await this.onNewEvent(
                { type: "textMessage", text: `${submission.target.name} is ruined...` },
            );

            if(submission.target.team === "enemy"){
                const activePlayerId = this.battle.activeCombatants.player;
                const getXp = submission.target.giveXp;
                await this.onNewEvent({
                    type: "textMessage", 
                    text: `Gained ${getXp}xp from {TARGET}`, 
                    target: submission.target,
                });

                await this.onNewEvent({
                    type: "getXp", 
                    xp: getXp, 
                    combatant: this.battle.combatants[activePlayerId],
                });
            }

            //winning team? end battle
            const winner = this.getWinner();
            if (winner === "player") {
                await this.onNewEvent({
                    type: "textMessage",
                    text: "Winner!",
                });
                this.onWinner(winner);
                return;
            }else if (winner === "enemy") {
                await this.onNewEvent({
                    type: "textMessage",
                    text: "Hahaha! Get out of my kitchen!",
                });
                this.onWinner(winner);
                return;
            }
            else {
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
        }

        //check for post event
        // do things after original turn submission
        const postEvents = caster.getPostEvents();
        for (let i = 0; i < postEvents.length; i++) {
            const event = {
                ...postEvents[i],
                submission,
                action: submission.action,
                caster: caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //caster die?
        const casterDie = caster.hp <= 0;
        if (casterDie) {
            await this.onNewEvent(
                { type: "textMessage", text: `${caster.name} is ruined...` },
            );

            if(caster.team === "enemy"){
                const activePlayerId = this.battle.activeCombatants.player;
                const getXp = caster.giveXp;
                await this.onNewEvent({
                    type: "textMessage", 
                    text: `Gained ${getXp}xp from {TARGET}`, 
                    target: submission.caster,
                });

                await this.onNewEvent({
                    type: "getXp", 
                    xp: getXp, 
                    combatant: this.battle.combatants[activePlayerId],
                });
            }

            //winning team? end battle
            const winner = this.getWinner();
            if (winner === "player") {
                await this.onNewEvent({
                    type: "textMessage",
                    text: "Winner!",
                });
                this.onWinner(winner);
                return;
            }else if (winner === "enemy") {
                await this.onNewEvent({
                    type: "textMessage",
                    text: "Hahaha! Get out of my kitchen!",
                });
                this.onWinner(winner);
                return;
            }
            else {
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
        }

        //check for status expire
        const expiredEvents = caster.decrementStatus();
        if (expiredEvents) {
            for(let i = 0; i < expiredEvents.length; i++)
            await this.onNewEvent(expiredEvents[i]);
        }

        this.nextTurn();
    }

    nextTurn() {
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }

    getWinner() {
        let aliveTeams = {};
        Object.values(this.battle.combatants).forEach(cmbt => {
            if (cmbt.hp > 0) {
                aliveTeams[cmbt.team] = true;
            }
        });
        if (!aliveTeams["player"]) { return "enemy" };
        if (!aliveTeams["enemy"]) { return "player" };
        return null;
    }

    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: `Goal: Beat ${this.battle.enemy.name}!`,
        });

        //start the first turn
        this.turn();
    }
}