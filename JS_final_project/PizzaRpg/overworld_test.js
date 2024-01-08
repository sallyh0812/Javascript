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

    bindAcionInput() {
        new KeyPressListener("Enter", () => {
            //is there a person here to talk to
            this.map.checkForActionCutscene();
        })
    }

    bindHeroPositionCheck() {
        //"PersonWalkingComplete" in person.js
        document.addEventListener("PersonWalkingComplete", e => {
            // if(e.detail.whoId === 'npc1'){
            //     console.log("npc1's position changed.")
            //     //this.map.checkForFootstepCutscene()
            // }
            if (e.detail.whoId === 'hero') {
                console.log("hero's position changed.")
                this.map.checkForFootstepCutscene()
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        //console.log(this.map.walls);
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.OverworldMaps.Kitchen);

        this.bindAcionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        //this.directionInput.direction; //return "down"


        this.startGameLoop();

        this.map.startCutscene([
            // {who: "npc1", type: "stand", direction:"down", time: 800},
            // {type: "textMessage", text: "Hello welcome to Pizza Legend! Are you ready?"},
            // {type: "changeMap", map: "DemoRoom"},
            {type: "battle"},
        ]);

        console.log("Hello from the Overworld!", this);
    }


}