"use strict";

class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.direction = "down";

        this.directionUpdate = {
            "down": ["y", 1],
            "up": ["y", -1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition(state);
        } else {
            //more casese for starting to walk

            //Case: keyboard ready and have arrow pressed
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                //console.log(state.arrow);
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow,
                })
            }
            this.updateSprite();
        }
    }


    startBehavior(state, behavior) {
        //set character direction to whatever behavior has
        this.direction = behavior.direction;

        if (behavior.type === "walk") {
            //stop if space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction) && this.movingProgressRemaining === 0) {
                if (behavior.retry) {
                    setTimeout(() => {
                        this.startBehavior(state, behavior);
                    }, 10);
                }
                return;
            }
            //ready to walk
            this.movingProgressRemaining = 16;
            state.map.moveWall(this.x, this.y, this.direction);
            this.updateSprite();
        }
        if (behavior.type === "stand") {
            this.isStanding = true;

            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id,
                })
                this.isStanding = false;
            }, behavior.time);
        }

    }

    updatePosition(state) {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            //finish walk
            utils.emitEvent("PersonWalkingComplete", {
                whoId: this.id,
            });
        }
    }


    updateSprite() {
        //console.log("update sprite");
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}