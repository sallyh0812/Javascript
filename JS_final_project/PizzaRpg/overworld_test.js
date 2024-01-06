"use strict";

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;

    }
    startGameLoop() {
        const step = () => {
            //step() -> infinite loop
            //console.log("stepping...");

            //clean obj in the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //establish the camera person
            const cameraPerson = this.map.gameObjects.hero;

            //update all objs
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            //draw lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //draw game objs
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y;       //if return >0: b->a, <0: a->b
            }).forEach(object => {
                //object.x += 1;
                object.sprite.draw(this.ctx, cameraPerson);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        console.log(this.map.walls);
        this.map.mountObjects();
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //return "down"
        this.startGameLoop();

        this.map.startCutscene([
            {who: "hero", type: "walk", direction:"down"},
            {who: "hero", type: "walk", direction:"down"},
            {who: "hero", type: "walk", direction:"left"},
            {who: "npc1", type: "walk", direction:"right"},
            {who: "npc1", type: "walk", direction:"right"},
            {who: "npc1", type: "stand", direction:"down", time: 800},
            {who: "npc2", type: "walk", direction:"right"},

        ]);

        console.log("Hello from the Overworld!", this);
    }


}