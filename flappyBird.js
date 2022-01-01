const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const birdSprite = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();
var frames = 0;

birdSprite.src = "images/birdSprite.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

const score_sound = new Audio();
const fly_sound = new Audio();

score_sound.src = "sounds/score.mp3";
fly_sound.src = "sounds/fly.mp3";

const gap = 90;

const degree = Math.PI / 180;

const bird = {
    animation : [
        { sX : 26, sY : 18 },
        { sX : 58, sY : 18 },
        { sX : 90, sY : 18 },
        { sX : 58, sY : 18 },
    ],
    x : 40,
    y : 300,
    width : 31,
    height: 23,
    frame : 0,
    speed : 0,
    gravity : 0.047,
    jump : 2.3,
    rotation : 0,


    draw : function(){
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(birdSprite, bird.sX, bird.sY, this.width, this.height, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    },

    update : function(){
        this.period = 10;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        this.speed += this.gravity; 
        bird.y += this.speed;

        if(this.speed >= this.jump-0.9)
        {
            this.rotation = 80 * degree;
            this.frame = 1;
        }
        else
        {
            this.rotation = -25 * degree;
        }
    },

    moveUp : function(){
        this.speed = -this.jump;
        fly_sound.play();
    }
}

function controller(){
    bird.moveUp();
}

document.addEventListener("keypress", controller);

const score = {

    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function(){
        ctx.fillStyle = "#F1F";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.font = "22px Teko";
        ctx.fillText("Score: " + this.value, 10, cvs.height/1.15);
        ctx.strokeText("Score: " + this.value, 10, cvs.height/1.15);
        ctx.fillText("Best: " + this.best, 10, cvs.height/1.05);
        ctx.strokeText("Best: " + this.best, 10, cvs.height/1.05);
    }
}

var pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0
};

function update()
{
    bird.update();
}

function draw()
{
    

    ctx.drawImage(bg, 0, 0);
    
    for(var i = 0; i < pipe.length; i++)
    {
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + pipeNorth.height + gap);

        pipe[i].x--;
        if(pipe[i].x == 80)
        {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        if(pipe[i].x == 35)
        {
            score.value++;
            score_sound.play();
            score.best = Math.max(score.value, score.best);
            localStorage.setItem("best", score.best);
        }

        if(bird.x + bird.width - 18 >= pipe[i].x && bird.x <= pipe[i].x + pipeNorth.width && (bird.y - 12 <= pipe[i].y + pipeNorth.height || bird.y + bird.height - 12 >= pipe[i].y + pipeNorth.height + gap))
        {
            location.reload();
        }

        
    }
    bird.draw();
    ctx.drawImage(fg, 0, cvs.height - fg.height);
    score.draw();
}

function loop(){
    draw();
    update();
    frames++;
    requestAnimationFrame(loop);
}

loop();