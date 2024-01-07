"use strict";

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        //beneath characters, floor, chair...
        this.lowerImg = new Image();
        this.lowerImg.src = config.lowerSrc;

        //cover on top of characters, ceiling, trees...
        this.upperImg = new Image();
        this.upperImg.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImg, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImg, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        //console.log("mounting");
        Object.keys(this.gameObjects).forEach(key => {
            let obj = this.gameObjects[key];
            obj.id = key; //hero, npc1, npc2

            //TODO: determine if this obj should mount
            obj.mount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        //start a loop for async events
        //await each one
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        //reset npc to do behavior
        Object.values(this.gameObjects).forEach(obj => {
            obj.doBehaviorEvent(this);
        })
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);

        const match = Object.values(this.gameObjects).find(obj => {
            return `${obj.x},${obj.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        console.log(match);
        if(match && match.talking.length && !this.isCutscenePlaying){
            this.startCutscene(match.talking[0].events);
        }
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }

}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./img/maps/DemoLower.png",
        upperSrc: "./img/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(4),
                y: utils.withGrid(5),
            }),
            npc1: new Person({
                x: utils.withGrid(6),
                y: utils.withGrid(8),
                src: "./img/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 1000 },
                    { type: "stand", direction: "up", time: 500 },
                    { type: "stand", direction: "right", time: 300 },
                    { type: "stand", direction: "up", time: 600 },

                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hi, how you do'in", faceHero: "npc1" },
                            { type: "textMessage", text: "Come with me!" },
                            { who: "npc1", type: "walk", direction: "up" },
                            { who: "hero", type: "walk", direction: "up" },
                        ],
                    },
                ]
            }),
            npc2: new Person({
                x: utils.withGrid(4),
                y: utils.withGrid(8),
                src: "./img/characters/people/npc2.png",
                behaviorLoop: [
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "down" },
                ],
            })
        },
        walls: {
            //"16,16":true,
            [utils.asGridCoords(7, 6)]: true,
            [utils.asGridCoords(8, 6)]: true,
            [utils.asGridCoords(7, 7)]: true,
            [utils.asGridCoords(8, 7)]: true,
        }
    },
    Kitchen: {
        lowerSrc: "./img/maps/KitchenLower.png",
        upperSrc: "./img/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(3),
                y: utils.withGrid(3),
            }),
            npc1: new Person({
                x: utils.withGrid(4),
                y: utils.withGrid(4),
                src: "./img/characters/people/npc1.png"
            }),
            npc2: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                src: "./img/characters/people/npc2.png"
            }),
            npc3: new Person({
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                src: "./img/characters/people/npc3.png"
            }),
        }
    },

}