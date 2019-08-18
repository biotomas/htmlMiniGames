window.onload = function() {
  state = gameState.INTRO;
  restartGame();
  setInterval(mainLoop, 15);
}

function restartGame() {
  initLevel(0);
  score = 0;
  startTime = Date.now();
}

function mainLoop() {
  update();
  draw();
}

var currentLevel = 0;
function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    console.log("winngin");
    endTime = Date.now();
    state = gameState.WON;
  } else {
    initLevel(currentLevel);
  }
}

function initLevel(lev) {
  currentLevel = lev;
  loadLevel(levels[lev]);
  level.precomputeShortestPaths();
  canvas.height = (level.heigth-1) * gridSize;
  canvas.width = level.width * gridSize;
  draw();	
}


/**
 * INPUT
 */

const keys = {
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40,
}

var downKeys = [];
var anyKeyDown = false;

function isDown(keycode) {
  return downKeys[keycode];
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  downKeys[evt.keyCode] = true;
  anyKeyDown = true;
};

document.onkeyup = function(evt) {
  evt = evt || window.event;
  downKeys[evt.keyCode] = false;
  anyKeyDown = false;
};

var canvas = document.getElementById("canvas");


canvas.addEventListener('click', function(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  if ((state == gameState.WON || state == gameState.DEAD) && y > 310 && y < 350) {
    if (x > 150 && x < 270) {
      state = gameState.PLAY;
      restartGame();
    }
    if (x > 290 && x < 410) {
      //TODO implement HighScore keeping
      console.log("clicked high score");
    }
  } 
  if (state == gameState.INTRO && x > 150 && x < 410 && y > 240 && y < 280) {
    console.log("clicked start game");
    state = gameState.PLAY;
    restartGame();
  }
}, false);

function limg(path) {
  img = new Image;
  img.src = path;
  return img;
}

/**
 * Graphics
 */
var heroFront = [], heroBack = [], heroLeft = [], heroRight = [];

heroFront[0] = limg('res/Mensch/v1.png');
heroFront[1] = limg('res/Mensch/v2.png');
heroFront[2] = limg('res/Mensch/v3.png');
heroBack[0] = limg('res/Mensch/h1.png');
heroBack[1] = limg('res/Mensch/h2.png');
heroBack[2] = limg('res/Mensch/h3.png');
heroLeft[0] = limg('res/Mensch/l1.png');
heroLeft[1] = limg('res/Mensch/l2.png');
heroLeft[2] = limg('res/Mensch/l3.png');
heroRight[0] = limg('res/Mensch/r1.png');
heroRight[1] = limg('res/Mensch/r2.png');
heroRight[2] = limg('res/Mensch/r3.png');

var enemyFront = [], enemyBack = [], enemyLeft = [], enemyRight = [];
enemyFront[0] = limg('res/Vogel/vv1.png');
enemyFront[1] = limg('res/Vogel/vv2.png');
enemyFront[2] = limg('res/Vogel/vv3.png');
enemyBack[0] = limg('res/Vogel/vh1.png');
enemyBack[1] = limg('res/Vogel/vh2.png');
enemyBack[2] = limg('res/Vogel/vh3.png');
enemyLeft[0] = limg('res/Vogel/vl1.png');
enemyLeft[1] = limg('res/Vogel/vl2.png');
enemyLeft[2] = limg('res/Vogel/vl3.png');
enemyRight[0] = limg('res/Vogel/vr1.png');
enemyRight[1] = limg('res/Vogel/vr2.png');
enemyRight[2] = limg('res/Vogel/vr3.png');


skullImage = limg('res/skull.png');

for (var i = 1; i <= 10; i++) {
  items[i-1] = limg('res/items/i'+i+'.png');
}

rockImage = limg('res/tree.png');
floorImage = limg('res/floor.png');
imbissImage = limg('res/imbiss.png');

var c = canvas.getContext("2d");
const gridSize = 40;

function draw() {
  // draw the map
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < level.grid.length; y++) {
		var ln = level.grid[y];
		for (var x = 0; x < ln.length; x++) {
			c.drawImage(floorImage,x*gridSize, y*gridSize);
		}
  }
  for (var y = 0; y < level.grid.length; y++) {
		var ln = level.grid[y];
		for (var x = 0; x < ln.length; x++) {
			switch (level.grid[y][x]) {
			case items.WALL:
				c.drawImage(rockImage,x*gridSize, y*gridSize-10, gridSize, gridSize+10);
				break;
			case items.COIN:
				c.drawImage(items[(x+y)%10],x*gridSize, y*gridSize, gridSize, gridSize);
				break;
			case items.BOX:
				c.drawImage(boxImage,x*gridSize, y*gridSize);
				break;
			case items.IMBISS:
				c.drawImage(imbissImage,x*gridSize, y*gridSize, 4*gridSize, 2.5*gridSize);
				break;
			
			}
		}
	}
  // draw the enemy
  var enemyImage = enemyFront[1];	
  var anim = Math.floor(((window.performance.now() % 1002)/100) % 3);
  if (enemy.direction == dir.UP) enemyImage = enemyBack[anim];
  if (enemy.direction == dir.DOWN) enemyImage = enemyFront[anim];
  if (enemy.direction == dir.LEFT) enemyImage = enemyLeft[anim];
  if (enemy.direction == dir.RIGHT) enemyImage = enemyRight[anim];
  c.drawImage(enemyImage ,(enemy.x-0.4)*gridSize, (enemy.y-0.7)*gridSize,1.5*gridSize,1.5*gridSize);
  // draw the hero
  var heroImage = skullImage;
  if (state != gameState.DEAD) {
    var anim = 1;
    if (anyKeyDown) anim = Math.floor(((window.performance.now() % 1002)/100) % 3);
    if (hero.direction == dir.UP) heroImage = heroBack[anim];
    if (hero.direction == dir.DOWN) heroImage = heroFront[anim];
    if (hero.direction == dir.LEFT) heroImage = heroLeft[anim];
    if (hero.direction == dir.RIGHT) heroImage = heroRight[anim];
  }
  c.drawImage(heroImage ,hero.x*gridSize, (hero.y-0.7)*gridSize,gridSize,1.5*gridSize);
  if (hero.x > level.width-1) {
    c.drawImage(heroImage ,(hero.x-level.width)*gridSize, hero.y*gridSize,gridSize,gridSize);
  }
  
  if (state == gameState.INTRO) {
    // draw intro screen
    c.fillStyle = "#595";
    c.fillRect(30,100,500, 200);
    c.textAlign = "center";
    c.fillStyle = "black";
    c.font = "20px Times";
    c.fillText("Guido hat alle seine Küchenutensilien im Wald verloren.", 280, 140);
    c.fillText("Hilf ihm, sie zu finden und zum Imbiss zurückzubringen.", 280, 160);
    c.fillText("Aber sei dir der bösen Krähe bewusst, du verlierst das", 280, 180);
    c.fillText("Spiel, wenn er dich fängt.", 280, 200);
    c.font = "bold 20px Times";
    c.fillText("Steuere den Guido mit den Pfeiltasten.", 280, 225);


    // start game button
    c.font = "20px Times";
    c.fillStyle = "#955";
    c.fillRect(150, 240, 260, 40);
    c.fillStyle = "black";
    c.fillText("Spiel Starten", 280, 265);
  }
  
  if (state == gameState.WON || state == gameState.DEAD) {
    // draw Endscreen
    c.fillStyle = "#595";
    c.fillRect(130,200,300, 160);
    c.textAlign = "center";
    c.fillStyle = "black";
    c.font = "30px Times";
    endStr = "Du hast es geschaft! :-)";
    if (state == gameState.DEAD) {
      endStr = "Game Over :'("
    }
    c.fillText(endStr, 280, 240);
    c.font = "20px Times";
    c.fillText("Dein score ist " + score + " in zeit " + ((endTime - startTime)/1000).toFixed(2), 280, 280);
    c.fillStyle = "#955";
    c.fillRect(150, 310, 120, 40);
    c.fillRect(290, 310, 120, 40);
    c.fillStyle = "black";
    c.fillText("Neu Starten", 210, 335);
    c.fillText("Highscore", 350, 335);
  } 
  if (state == gameState.PLAY) {
    // draw the HUD
    c.fillStyle = "#9c9";
    c.fillRect(130,520,300, 35);
    c.textAlign = "center";
    c.fillStyle = "black";
    c.font = "20px Courier New";
    timeStr = ((Date.now() - startTime)/1000).toFixed(2).padStart(6,' ');
    c.fillText("Score: " + (score+"").padStart(3,' ') + " Zeit: " + timeStr, 280, 544);
  } 
}

function drawIfPresent(item, img) {
  if (item) {
		c.drawImage(img,item.x*gridSize, item.y*gridSize);
  }
}

