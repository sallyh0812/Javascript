"use strict";
const WIDTH = 480, HEIGHT = 270;

class Component {
	constructor (width, height, color, x, y, type="default") {
		this.type = type;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;
	}
	update(ctx) {
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
}
class Background extends Component {
	static img;
	static {
		Background.img = new Image();
		Background.img.src = 'citymarket.jpg'; // 656 * 270
	}
	constructor() {
		super(656, 270, "background", 0, 0);
	}
	update(ctx) {
		ctx.drawImage(Background.img,this.x,this.y,this.width,this.height);
		ctx.drawImage(Background.img,this.x+this.width,this.y,this.width,this.height);
		this.x--;
		if (this.x === -this.width) this.x = 0;
	}
}
class Bird extends Component {
	static img;
	static {
		Bird.img = new Image();
		Bird.img.src = 'flappy30.png'; // 279 * 30 (8 frames)
	}
	#ptr; // private 
	constructor(color, x, y) {
		super(30, 30, color, x, y);
		this.#ptr = 0;
		this.speedX = 0;
		this.speedY = 0;    
		this.gravity = 0;
		this.gravitySpeed = 0;
	}
    crashWith(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;

        let rockbottom = HEIGHT - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
	update(ctx) {
		ctx.drawImage(Bird.img, this.#ptr*35, 0, 32, 30, this.x, this.y, 32, 30);
		this.#ptr = (this.#ptr+1) % 8;
	}
}
class Message extends Component {
	constructor(w, family, color, x, y) {
		super(w, 0, color, x, y, "text");
		this.family = family;
	}
	update(ctx, msg) {
		ctx.font = this.width + " " + this.family;
		ctx.fillStyle = this.color;
		ctx.textAlign = "center";
		ctx.fillText(msg, this.x, this.y);
	}	
}
class Score extends Message {
	constructor() {
		super("30px", "標楷體", "black", WIDTH-80, 40);		
		this.score = 0;
	}
	inc() {
		this.score++;
	}
	update(ctx) {
		super.update(ctx,"分數:"+this.score);
	}
}

let myGamePiece;
let myObstacles = [];
let myScore, myMessage, myBackground;

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (let i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
			myMessage.update(myGameArea.context, "Game Over");
			console.log("game over");
            return;
        } 
    }
    myGameArea.clear();
    myBackground.update(myGameArea.context);
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (let i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update(myGameArea.context);
    }
    myScore.inc();
	myScore.update(myGameArea.context);
    myGamePiece.newPos();
    myGamePiece.update(myGameArea.context);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

window.addEventListener('load', function() {
    myGamePiece = new Bird("red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new Score();
	myBackground = new Background();
	myMessage = new Message("30px", "標楷體", "red", WIDTH/2, HEIGHT/2); // 
    myGameArea.start();
});

window.addEventListener('keydown', function (e) {
    e = e || window.event;
    console.log("e.code:", e.code);
    if (e.code == 'ArrowUp') {
        accelerate(-0.2);
    }
    else if (e.code == 'ArrowDown') {
        accelerate(0.2);
    }
});

window.addEventListener('keyup', function (e) {
    accelerate(0.05);
});