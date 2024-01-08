"use strict";

class OverworldMap {
    constructor(config) {

        this.overworld = null;

        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || [];
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
        if (match && match.talking.length && !this.isCutscenePlaying) {
            this.startCutscene(match.talking[0].events);
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        //console.log(match);

        if (match && !this.isCutscenePlaying) {
            this.startCutscene(match[0].events);
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
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "./img/characters/people/npc2.png",
                // behaviorLoop: [
                //     { type: "walk", direction: "left" },
                //     { type: "stand", direction: "up", time: 800 },
                //     { type: "walk", direction: "up" },
                //     { type: "walk", direction: "right" },
                //     { type: "walk", direction: "down" },
                // ],
            })
        },
        walls: {
            //"16,16":true,
            [utils.asGridCoords(0, 1)]: true,
            [utils.asGridCoords(0, 2)]: true,
            [utils.asGridCoords(0, 3)]: true,
            [utils.asGridCoords(0, 4)]: true,
            [utils.asGridCoords(0, 5)]: true,
            [utils.asGridCoords(0, 6)]: true,
            [utils.asGridCoords(0, 7)]: true,
            [utils.asGridCoords(0, 8)]: true,
            [utils.asGridCoords(0, 9)]: true,

            [utils.asGridCoords(11, 1)]: true,
            [utils.asGridCoords(11, 2)]: true,
            [utils.asGridCoords(11, 3)]: true,
            [utils.asGridCoords(11, 4)]: true,
            [utils.asGridCoords(11, 5)]: true,
            [utils.asGridCoords(11, 6)]: true,
            [utils.asGridCoords(11, 7)]: true,
            [utils.asGridCoords(11, 8)]: true,
            [utils.asGridCoords(11, 9)]: true,

            [utils.asGridCoords(1, 3)]: true,
            [utils.asGridCoords(2, 3)]: true,
            [utils.asGridCoords(3, 3)]: true,
            [utils.asGridCoords(4, 3)]: true,
            [utils.asGridCoords(5, 3)]: true,
            [utils.asGridCoords(6, 3)]: true,
            [utils.asGridCoords(7, 3)]: true,
            [utils.asGridCoords(8, 3)]: true,
            [utils.asGridCoords(9, 3)]: true,
            [utils.asGridCoords(10, 3)]: true,

            [utils.asGridCoords(1, 10)]: true,
            [utils.asGridCoords(2, 10)]: true,
            [utils.asGridCoords(3, 10)]: true,
            [utils.asGridCoords(4, 10)]: true,
            [utils.asGridCoords(5, 11)]: true,
            [utils.asGridCoords(6, 10)]: true,
            [utils.asGridCoords(7, 10)]: true,
            [utils.asGridCoords(8, 10)]: true,
            [utils.asGridCoords(9, 10)]: true,
            [utils.asGridCoords(10, 10)]: true,

            [utils.asGridCoords(8, 4)]: true,
            [utils.asGridCoords(6, 4)]: true,

            [utils.asGridCoords(7, 6)]: true,
            [utils.asGridCoords(8, 6)]: true,
            [utils.asGridCoords(7, 7)]: true,
            [utils.asGridCoords(8, 7)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(7, 4)]: [
                {
                    events: [
                        { who: "npc2", type: "walk", direction: "left" },
                        { who: "npc2", type: "stand", direction: "up", time: 300 },
                        { type: "textMessage", text: "You can't be in there!" },
                        { who: "npc2", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" },
                    ]
                }
            ],
            [utils.asGridCoords(5, 10)]: [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen" },
                    ]
                }
            ],
        }
    },
    Kitchen: {
        lowerSrc: "./img/maps/KitchenLower.png",
        upperSrc: "./img/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(3),
                y: utils.withGrid(5),
            }),
            npc3: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "./img/characters/people/npc3.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 1000 },
                    { type: "walk", direction: "left" },
                    { type: "walk", direction: "right" },
                    { type: "stand", direction: "up", time: 600 },

                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "You made it!", faceHero: "npc3" }
                        ],
                    },
                ]
            }),
        },
        walls: {
            //"16,16":true,
            [utils.asGridCoords(0, 1)]: true,
            [utils.asGridCoords(0, 2)]: true,
            [utils.asGridCoords(0, 3)]: true,
            [utils.asGridCoords(0, 4)]: true,
            [utils.asGridCoords(0, 5)]: true,
            [utils.asGridCoords(0, 6)]: true,
            [utils.asGridCoords(0, 7)]: true,
            [utils.asGridCoords(0, 8)]: true,
            [utils.asGridCoords(0, 9)]: true,

            [utils.asGridCoords(13, 1)]: true,
            [utils.asGridCoords(13, 2)]: true,
            [utils.asGridCoords(13, 3)]: true,
            [utils.asGridCoords(13, 4)]: true,
            [utils.asGridCoords(13, 5)]: true,
            [utils.asGridCoords(13, 6)]: true,
            [utils.asGridCoords(13, 7)]: true,
            [utils.asGridCoords(13, 8)]: true,
            [utils.asGridCoords(13, 9)]: true,

            [utils.asGridCoords(1, 3)]: true,
            [utils.asGridCoords(2, 3)]: true,
            [utils.asGridCoords(3, 3)]: true,
            [utils.asGridCoords(4, 3)]: true,
            [utils.asGridCoords(5, 3)]: true,
            [utils.asGridCoords(6, 3)]: true,
            [utils.asGridCoords(7, 3)]: true,
            [utils.asGridCoords(8, 3)]: true,
            [utils.asGridCoords(9, 3)]: true,
            [utils.asGridCoords(10, 3)]: true,

            [utils.asGridCoords(1, 10)]: true,
            [utils.asGridCoords(2, 10)]: true,
            [utils.asGridCoords(3, 10)]: true,
            [utils.asGridCoords(4, 10)]: true,
            [utils.asGridCoords(5, 11)]: true,
            [utils.asGridCoords(6, 10)]: true,
            [utils.asGridCoords(7, 10)]: true,
            [utils.asGridCoords(8, 10)]: true,
            [utils.asGridCoords(9, 10)]: true,
            [utils.asGridCoords(10, 10)]: true,
            [utils.asGridCoords(11, 10)]: true,
            [utils.asGridCoords(12, 10)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(5, 10)]: [
                {
                    events: [
                        { type: "changeMap", map: "DemoRoom" },
                    ]
                }
            ],
        }
    },

}