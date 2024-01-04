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
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            //draw lower layer
            this.map.drawLowerImage(this.ctx);

            //draw game objs
            Object.values(this.map.gameObjects).forEach(object=>{
                //object.x += 1;
                object.update({
                    arrow: this.directionInput.direction
                })
                object.sprite.draw(this.ctx);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx);
            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }
    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //return "down"
        this.startGameLoop();

        console.log("Hello from the Overworld!", this);
    }


}