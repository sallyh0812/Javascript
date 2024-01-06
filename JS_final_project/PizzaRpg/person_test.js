"use strict";

class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
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
            this.updatePosition();
        } else {
            //more casese for starting to walk

            //Case: we're keyboard ready and have arrow pressed
            if (this.isPlayerControlled && state.arrow) {
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
            console.log(state.map.isSpaceTaken(this.x, this.y, this.direction));

            //stop if space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }
            //ready to walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16;
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;
    }


    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}