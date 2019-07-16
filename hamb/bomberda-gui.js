window.onload = function() {
	initLevel();
  setInterval(mainLoop, 15);
}

function mainLoop() {
  update();
  draw();
}


function initLevel() {
  loadLevel(levels[0]);
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

function isDown(keycode) {
  return downKeys[keycode];
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  downKeys[evt.keyCode] = true;
};

document.onkeyup = function(evt) {
  evt = evt || window.event;
  downKeys[evt.keyCode] = false;
};

/**
 * Graphics
 */

heroImage = new Image;
heroImage.src = 'res/hero.png';
skullImage = new Image;
skullImage.src = 'res/skull.png';

for (var i = 1; i <= 10; i++) {
  items[i-1] = new Image;
  items[i-1].src='res/items/i'+i+'.png';
}

enemyImage = new Image;
enemyImage.src = 'res/enemy.png';
rockImage = new Image;
rockImage.src = 'res/tree.png';
floorImage = new Image;
floorImage.src = 'res/floor.png';

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
const gridSize = 60;

function draw() {
  // draw the map
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < level.grid.length; y++) {
		var ln = level.grid[y];
		for (var x = 0; x < ln.length; x++) {
			c.drawImage(floorImage,x*gridSize, y*gridSize);
			switch (level.grid[y][x]) {
			case items.WALL:
				c.drawImage(rockImage,x*gridSize, y*gridSize-10);
				break;
			case items.COIN:
				c.drawImage(items[(x+y)%10],x*gridSize, y*gridSize, gridSize, gridSize);
				break;
			case items.BOX:
				c.drawImage(boxImage,x*gridSize, y*gridSize);
				break;
			}
		}
	}
  drawIfPresent(enemy,enemyImage);
  // draw the hero
  c.drawImage(hero.dead ? skullImage : heroImage ,hero.x*gridSize, hero.y*gridSize);
  if (hero.x > level.width-1) {
    c.drawImage(hero.dead ? skullImage : heroImage ,(hero.x-level.width)*gridSize, hero.y*gridSize);
  }
}

function drawIfPresent(item, img) {
  if (item) {
		c.drawImage(img,item.x*gridSize, item.y*gridSize);
  }
}

