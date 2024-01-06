"use strict";

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        //beneath characters, floor, chair...
        this.lowerImg = new Image();
        this.lowerImg.src = config.lowerSrc;

        //cover on top of characters, ceiling, trees...
        this.upperImg = new Image();
        this.upperImg.src = config.upperSrc;
    }
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImg, utils.withGrid(10.5) -cameraPerson.x , utils.withGrid(6) -cameraPerson.y);
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImg, utils.withGrid(10.5) -cameraPerson.x , utils.withGrid(6) -cameraPerson.y);
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
                src: "./img/characters/people/npc1.png"
            })
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