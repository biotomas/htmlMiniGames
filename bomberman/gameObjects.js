/**
 * 
 */

// Images are here because of pre-loading
heroImage = new Image;
heroImage.src = 'res/hero.png';
skullImage = new Image;
skullImage.src = 'res/skull.png';
fireImage = new Image;
fireImage.src = 'res/fire.png';
coinImage = new Image;
coinImage.src = 'res/coin.png';
enemyImage = new Image;
enemyImage.src = 'res/enemy.png';
bombImage = new Image;
bombImage.src = 'res/bomb.png';
boxImage = new Image;
boxImage.src = 'res/box.png';
rockImage = new Image;
rockImage.src = 'res/rock.png';
floorImage = new Image;
floorImage.src = 'res/floor.png';

class BaseGO {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	
	moveTo(x,y) {
		this.x = x;
		this.y = y;
	}
	
	draw(c) {
		c.drawImage(this.img,this.x*gridSize, this.y*gridSize);
	}
}

class Hero extends BaseGO {
	constructor(x,y) {
		super(x,y)
		this.img = heroImage;
	}
	
	die() {
		this.img = skullImage;
	}
	
	update() {
		if (enemy && this.x == enemy.x && this.y == enemy.y) {
			die();
			return true;
		}
		if (this.x == coin.x && this.y == coin.y) {
			console.log("win");
			nextLevel();
			return true;
		}
		return false;
	}
}


class Spider extends BaseGO {
	constructor(x,y) {
		super(x,y)
		this.img = enemyImage;
	}
	
	update() {
		if (this.x == hero.x && this.y == hero.y) {
			die();
			return true;
		}
		return false;
	}
	
}

class Coin extends BaseGO {
	constructor(x,y) {
		super(x,y)
		this.img = coinImage;
	}
}



class Bomb extends BaseGO {
	constructor(x,y) {
		super(x,y)
		this.time = 3;
		this.active = true;
		this.exploding = false;
	}
	
	explosion(x,y) {
		level.explosion(x,y);
		if (hero.x == x && hero.y == y) {
			die();
			return;
		}
		if (enemy && enemy.x == x && enemy.y == y) {
			enemy = null;
			return;
		}
		
	}

	update() {
		if (!this.active) return;
		if (this.exploding) {
			this.exploding = false;
			this.active = false;
			return;
		}
		this.time--;
		if (this.time == 0) {
			this.exploding = true;
			this.explosion(this.x,this.y);
			this.explosion(this.x+1,this.y);
			this.explosion(this.x-1,this.y);
			this.explosion(this.x,this.y+1);
			this.explosion(this.x,this.y-1);
		}
	}
	
	draw (c) {
		if (!this.active) return;
		if (this.exploding) {
			c.drawImage(fireImage, this.x*gridSize, this.y*gridSize);
			c.drawImage(fireImage, (this.x+1)*gridSize, this.y*gridSize);
			c.drawImage(fireImage, (this.x-1)*gridSize, this.y*gridSize);
			c.drawImage(fireImage, this.x*gridSize, (this.y+1)*gridSize);
			c.drawImage(fireImage, this.x*gridSize, (this.y-1)*gridSize);
		} else {
			c.drawImage(bombImage, this.x*gridSize, this.y*gridSize);
			c.font = "30px Arial,bold";
			c.fillStyle = 'white';
			c.fillText(this.time,this.x*gridSize+10, this.y*gridSize+50);
			c.stroke();			
		}
	}
}

class Level {
	constructor(levelString) {
		this.grid = levelString.split("\n").map(function(x){return x.split("")});
	}
	
	find(item) {
		for (var y = 0; y < this.grid.length; y++) {
			for (var x = 0; x < this.grid[y].length; x++) {
				if (this.grid[y][x] == item) {
					return {x,y};
				}
			}
		}
	}
	
	explosion(x,y) {
		if (this.grid[y][x] == items.BOX) {
			this.grid[y][x] = items.FLOOR;
		}
	}
	
	walkable(x,y) {
		var item = this.grid[y][x];
		return item != items.WALL && item != items.BOX;
	}
	
	draw(c) {
		c.clearRect(0, 0, canvas.width, canvas.height);
		for (var y = 0; y < this.grid.length; y++) {
			var ln = this.grid[y];
			for (var x = 0; x < ln.length; x++) {
				c.drawImage(floorImage,x*gridSize, y*gridSize);
				switch (this.grid[y][x]) {
				case items.WALL:
					c.drawImage(rockImage,x*gridSize, y*gridSize);
					break;
				case items.BOX:
					c.drawImage(boxImage,x*gridSize, y*gridSize);
					break;
				}
			}
		}
	}
	
}