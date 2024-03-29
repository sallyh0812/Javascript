"use strict";

class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who] //this.event.who ->　obj.id
        who.startBehavior({     //startBehavior(state, behavior)
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time,
        })

        //set up a handler to complete when correct person is done walking then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonStandComplete", completeHandler);
    }

    async walk(resolve) {
        const who = this.map.gameObjects[this.event.who] //this.event.who ->　obj.id
        //startBehavior(state, behavior)
        await who.startBehavior({map: this.map}, {
            type: "walk",
            direction: this.event.direction,
            retry: true,
        });

        //set up a handler to complete when correct person is done walking then resolve the event
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                if(e.detail.whoId === "npc1"){
                    console.log("walking complete");
                }
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    textMessage(resolve) {
        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            //get the direction opposite of the hero's direction to face to hero
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve(),
        })
        message.init(document.querySelector(".game-container"));
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();

        //container, callback
        sceneTransition.init(document.querySelector(".game-container"), () => {
            console.log("animation end");
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
            resolve();

            sceneTransition.fadeOut();
        })
    }

    battle(resolve) {
        const battle = new Battle({
            enemy: window.enemies[this.event.enemyId],
            onComplete: () => {
                resolve();
            }
        })
        battle.init(document.querySelector(".game-container"));
    }

    init() {
        //console.log("OverworldEvent init");
        return new Promise(resolve => {
            this[this.event.type](resolve);  //this.event.type -> "walk", "stand"
        })
    }
}