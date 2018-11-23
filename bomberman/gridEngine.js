/**
 * 
 */

const keys = {
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40,
		RESTART:82,
		UNDO:85,
		SPACE:32
}


var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var bomb;
var hero;
var level;
var enemy;
var coin;

function draw() {
	level.draw(c);
	coin.draw(c);
	if (enemy) {
		enemy.draw(c);
	}
	if (bomb) {
		bomb.draw(c);
	}
	hero.draw(c);
}
window.onload = function() {
	nextLevel();
}

function die() {
	console.log("called die");
	hero.die();
	draw();
	setTimeout(restartLevel, 500);
}


function restartLevel() {
	console.log("called restart");
	level = new Level(document.getElementById("customLevel").value);
	hloc = level.find(items.PLAYER);
	hero = new Hero(hloc.x,hloc.y);
	cloc = level.find(items.COIN);
	coin = new Coin(cloc.x,cloc.y);
	eloc = level.find(items.ENEMY);
	if (eloc) {
		enemy = new Spider(eloc.x,eloc.y);
	} else {
		enemy = null;
	}
	bomb = null;
	draw();	
}

function nextLevel() {
	document.getElementById("customLevel").value = levels[levelId];
	levelId++;
	levelId = levelId % levels.length;
	restartLevel();
}

document.onkeydown = function(evt) {
	evt = evt || window.event;
	
	if (evt.keyCode == keys.RESTART) {
		restartLevel();
		return;
	}
	
	if (evt.keyCode == keys.SPACE) {
		// placing a bomb
		bomb = new Bomb(hero.x,hero.y);
		draw();
		return;
	}
	
	cx = hero.x;
	cy = hero.y;
	gx = cx;
	gy = cy;
	switch (evt.keyCode) {
	case keys.LEFT: 
		gx--;
		break;
	case keys.RIGHT: 
		gx++;
		break;
	case keys.UP: 
		gy--;
		break;
	case keys.DOWN: 
		gy++;
		break;
	default:
		return;
	}
	
	if (level.walkable(gx,gy)) {
		hero.moveTo(gx,gy);
		if (hero.update()) {
			return;
		}
		if (enemy) {
			gex = enemy.x - gx + cx;
			gey = enemy.y - gy + cy;
			if (level.walkable(gex,gey)) {
				enemy.moveTo(gex,gey);
			}
			if (enemy.update()) {
				return ;
			}
		}
		if (bomb) {
			if (bomb.update()) {
				return;
			}
		}
		draw();		
	}
};
