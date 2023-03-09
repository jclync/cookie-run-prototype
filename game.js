let cookieChar, ground, blobs;
let spriteX, spriteY, spriteSize, spriteSpeed;
let song;

let currentScore, highScore, lives, life, gameOver; 
let noLives = "Lives: 💔 💔 💔";
let oneLife = "Lives: ❤️‍🔥 💔 💔";
let twoLives = "Lives: ❤️‍🔥 ❤️‍🔥 💔";
let threeLives = "Lives: ❤️‍🔥 ❤️‍🔥 ❤️‍🔥";

let messageSent = false;

function preload() {
    happyMole = loadImage('images/happyBobaBee.gif');
    sadMole = loadImage('images/sadBobaBee.gif');
    owSong = loadSound('audio/ow.mp3');
    wrongSong = loadSound('audio/wrong.mp3');
  }

function setup() {
    createCanvas(800, 450, 'pixelated');
    spriteSize = 40;
    spriteX = 60;
    spriteY = height/2 - spriteSize/2;
    ground = new Sprite(0, height/4*3, width*3, 5, 'static');
    blobs = new Group();
    cookieChar = new Sprite(spriteX, spriteY, spriteSize);
    cookieChar.img = happyMole;
    world.gravity.y = 10.8;
  
    // resize images
    happyMole.resize(70, 70);
    sadMole.resize(60, 60);  
    
    // set scores and stuff
    currentScore = 0;
    highScore = 0;
    lives = 3;
    gameOver = false;
    spriteSpeed = 0;
}

function draw() {
    if (!gameOver) {
        playGame();
        cookieChar.debug = mouse.pressing();
    }
}

function playGame() {  
  //set game screen text
  setGameScreen();

  if (random(1) < 0.01) {
      new blobs.Sprite(width, (height/4*3) - spriteSize/2, spriteSize);
  }

  spriteSpeed = 2 + sqrt(currentScore)/5;
  blobs.move(width*2, 'left', spriteSpeed);

  if (cookieChar.collides(blobs)) {
      blobs.removeAll();
      cookieChar.sleeping = true;
      updateLives();
      cookieChar.sleeping = true;
  }
}

function setGameScreen() {
    textSize(15);
    background(240);
    fill(0);
    textAlign(LEFT);
    currentScore += 1/50;
    checkLives();
    text(life + '\nScore: ' + round(currentScore), 30, 30);
    textAlign(RIGHT);
    text('High Score: ' + highScore, width - 30, 30); 
    text('Press space or up arrow to jump. \n Press (q) to quit.', width - 30, (height / 4 * 3) + 50);
}

// 'space' or uparrow to jump; enter or 'r' to restart
function keyPressed() {
    if (keyCode == UP_ARROW) {
        cookieChar.move(125, 'up', 6.5);
    } else if (key == ' ') { 
        cookieChar.move(125, 'up', 6.5);
    } else if (keyCode == '13') {
        restart();
        playGame();
    } else if (keyCode == '82') {
        restart();
        playGame();
    } else if (keyCode == '81') {
        endGame();
    }
    return false;
}

function checkLives() {
    if (lives == 3) {
        life = threeLives;
    } else if (lives == 2) {
        life = twoLives;
    } else if (lives == 1) {
        life = oneLife;
    } else {
        life = noLives;
    }
}

function updateLives() {
    owSong.play();
    lives--;
    console.log(lives);
    
    if (lives == 0) {
        console.log("GAME OVER");
        endGame();
    }
}

function endGame() {
    gameOver = true;
    
    // reset and clear screen
    cookieChar.sleeping = true;
    cookieChar.img = sadMole;
    blobs.removeAll();
    background(0);
    
    checkScore();
    
    textAlign(CENTER);
    textSize(40);
    fill('red');
    text("Game Over 😔", width / 2, height / 5);
    textSize(20);
    fill(255);
    text("Your Score: " + round(currentScore) + "\n Your High Score: " + round(highScore) + "\n \n \n Press enter to play again!", width/2, height/3
        );
    
    if (!messageSent) {
        window.sendScore(highScore);
        messageSent = true;
    }
    
    //image(sMole, width/8, height/3*2, 200, 200);
}

function checkScore() {
    if (currentScore > highScore) {
        highScore = round(currentScore);
    }
}

function restart() {
    lives = 3;
    currentScore = 0;
    gameOver = false;
    messageSent = false;
    cookieChar.img = happyMole;
}