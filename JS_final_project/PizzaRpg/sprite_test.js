"use strict";

class Sprite {
    constructor(config) {

        //set up the img
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
            console.log("onload");
        }

        //shadow
        this.shadow = new Image();
        this.useShadow = true; // config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "./img/characters/shadow.png"
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }


        //configuring Animation and initial state
        this.animations = config.animations || {
            "idle-down": [[0, 0]],
            "idle-right": [[0, 1]],
            "idle-up": [[0, 2]],
            "idle-left": [[0, 3]],
            "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
            "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
            "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2]],
            "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3]],
        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 4;
        this.animationFrameProgress = this.animationFrameLimit;

        //reference the game obj
        this.gameObject = config.gameObject;
    }

    get frame() {
        //console.log(this.animations[this.currentAnimation][this.currentAnimationFrame]);
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        //console.log(key);
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //Downtick frameprogress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //reset animation progree
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        //console.log(this.frame);

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }


    //draw img
    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 +utils.withGrid(6) - cameraPerson.y;

        if (this.isShadowLoaded) {
            ctx.drawImage(this.shadow, x, y,)
        }

        const [frameX, frameY] = this.frame;

        if (this.isLoaded) {
            ctx.drawImage(this.image,
                frameX * 32, frameY * 32,
                32, 32,
                x, y,
                32, 32
            )
            //console.log("draw successful");
        } else {
            //console.log("draw failed");
        }

        this.updateAnimationProgress();
    }
}