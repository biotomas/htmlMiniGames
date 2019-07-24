

var hero;
var level;
var enemy;


const items = {
		WALL:"#",
		PLAYER:"@",
		COIN:".",
		FLOOR:" ",
		ENEMY:"E",
		IMBISS:"I",
		IMBISSC:"C",
        UNDEF:"-",
};

const moves = {
  GO_UP:"up",GO_DOWN:"down",GO_LEFT:"left",GO_RIGHT:"right"
};

const dir = {
  UP:"up",DOWN:"down",LEFT:"left",RIGHT:"right"
};

function die() {
	console.log("Hero died");
  hero.dead = true;
}

var maze;

function loadLevel(levstr) {
  // levstr = document.getElementById("customLevel").value
	level = new Level(levstr);
	var hloc = level.find(items.PLAYER);
  console.log(hloc);
	hero = new Hero(hloc.x,hloc.y);
	var eloc = level.find(items.ENEMY);
	if (eloc) {
		enemy = new Spider(eloc.x,eloc.y);
	} else {
		enemy = null;
	}
}

const move_tolerance = 0.2;
const move_speed = 0.1;
// must be less than 0.1
const move_speed_enemy = 0.05;

function update() {
  var gx = hero.x;
  var gy = hero.y;
  if (isDown(keys.UP)) gy -= move_speed;
  if (isDown(keys.DOWN)) gy += move_speed;
  if (isDown(keys.LEFT)) gx -= move_speed;
  if (isDown(keys.RIGHT)) gx += move_speed;

  // wrap around
  if (gx < 0) gx = level.width + gx;
  if (gx > level.width) gx = gx - level.width;

  var igx1 = Math.floor(gx + move_tolerance);
  var igy1 = Math.floor(gy + move_tolerance);
  var igx2 = Math.floor(gx + 1 - move_tolerance);
  var igy2 = Math.floor(gy + 1 - move_tolerance);
  var igx3 = Math.floor(gx + move_tolerance);
  var igy3 = Math.floor(gy + 1 - move_tolerance);
  var igx4 = Math.floor(gx + 1 - move_tolerance);
  var igy4 = Math.floor(gy + move_tolerance);
  var upleft = level.walkable(igx1,igy1);
  var downright = level.walkable(igx2,igy2);
  var upright = level.walkable(igx4,igy4);
  var downleft = level.walkable(igx3,igy3);

  // trying to go right
  if (gx > hero.x && (!upright || !downright)) gx = hero.x;
  // trying to go left
  if (gx < hero.x && (!upleft || !downleft)) gx = hero.x;

  // trying to go up
  if (gy < hero.y && (!upleft || !upright)) gy = hero.y;
  // trying to go down
  if (gy > hero.y && (!downleft || !downright)) gy = hero.y;
  hero.moveTo(gx,gy);


  //coin collecting
  var cx = Math.floor(gx+0.5);
  var cy = Math.floor(gy+0.5);
  if (level.grid[cy][cx] == items.COIN) {
    level.grid[cy][cx] = items.FLOOR;
    console.log("coin collected");
	}	

  // enemy
  enemy.goto(gx,gy);
  
  hero.update();
}

class BaseGO {
	constructor(x,y) {
		this.x = x;
		this.y = y;
        this.direction = dir.DOWN;
	}
	
	moveTo(x,y) {
	    if (x > this.x) this.direction = dir.RIGHT;
	    if (x < this.x) this.direction = dir.LEFT;
	    if (y > this.y) this.direction = dir.DOWN;
	    if (y < this.y) this.direction = dir.UP;
		this.x = x;
		this.y = y;
	}
	
}

class Hero extends BaseGO {
	constructor(x,y) {
		super(x,y)
    this.dead = false;
    this.win = false;
	}
		
	update() {
		var ix = Math.floor(this.x+0.5);
        var iy = Math.floor(this.y+0.5);
		var ex = Math.floor(enemy.x+0.5);
        var ey = Math.floor(enemy.y+0.5);
		if (ix == ex && iy == ey) {
			die();
		}
        var here = level.grid[iy][ix];
        if (here == items.IMBISS || here == items.IMBISSC) {
            nextLevel();
        } 
	}
}


class Spider extends BaseGO {
	constructor(x,y) {
		super(x,y)
	}

  goto(x,y) {
    var mx = Math.floor(this.x+0.5);
    var my = Math.floor(this.y+0.5);

    x = Math.floor(x+0.5);
    y = Math.floor(y+0.5);
    // wrap around
    if (x <= 0) x = level.width + x;
    if (x >= level.width) x = x - level.width;
    //console.log("enemy at " + x + "," + y);
    
    var goal = level.next[mx+","+my+"-"+x+","+y];
    var gx = this.x;
    var gy = this.y;
    //console.log("going from " + mx + "," + my + "(" + this.x + "," + this.y + ") to " + goal.x + "," + goal.y);
    if (Math.abs(goal.x - this.x) > 0.1) {
      if (this.x > goal.x) gx -= move_speed_enemy;
      if (this.x < goal.x) gx += move_speed_enemy;
    }
    if (Math.abs(goal.y - this.y) > 0.1) {
      if (this.y > goal.y) gy -= move_speed_enemy;
      if (this.y < goal.y) gy += move_speed_enemy;
    }
    this.moveTo(gx,gy);
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
	}
}

class Point {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}

class Level {
	constructor(levelString) {
		this.grid = levelString.split("\n").map(function(x){return x.split("")});
    this.heigth = this.grid.length;
    this.width = 0;
		for (var y = 0; y < this.grid.length; y++) {
      if (this.grid[y].length > this.width) {
        this.width = this.grid[y].length;
      }
    }
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
  	
	walkable(x,y) {
		var item = this.grid[y][x];
		return item != items.WALL;
	}

  precomputeShortestPaths() {
    var nodes = [];
    var dist = [];
    this.next = [];
		for (var y = 0; y < this.grid.length; y++) {
			for (var x = 0; x < this.grid[y].length; x++) {
				if (this.walkable(x,y)) {
					nodes.push(new Point(x,y));
          dist[x+","+y+"-"+x+","+y] = 0;
          this.next[x+","+y+"-"+x+","+y] = new Point(x,y);
  				if (this.walkable(x+1,y)) {
            dist[x+","+y+"-"+(x+1)+","+y] = 1;
            this.next[x+","+y+"-"+(x+1)+","+y] =  new Point(x+1,y);
          }
  				if (this.walkable(x-1,y)) {
            dist[x+","+y+"-"+(x-1)+","+y] = 1;
            this.next[x+","+y+"-"+(x-1)+","+y] =  new Point(x-1,y);
          }
  				if (this.walkable(x,y+1)) {
            dist[x+","+y+"-"+x+","+(y+1)] = 1;
            this.next[x+","+y+"-"+x+","+(y+1)] =  new Point(x,y+1);
          }
  				if (this.walkable(x,y-1)) {
            dist[x+","+y+"-"+x+","+(y-1)] = 1;
            this.next[x+","+y+"-"+x+","+(y-1)] =  new Point(x,y-1);
          }
				}

			}
		}
    for (var i = 0; i < nodes.length; i++)
      for (var j = 0; j < nodes.length; j++) {
        var pi = nodes[i];
        var pj = nodes[j];
        if (!(pi.x+","+pi.y+"-"+pj.x+","+pj.y in dist))
          dist[pi.x+","+pi.y+"-"+pj.x+","+pj.y] = 10000;
    }

    for (var k = 0; k < nodes.length; k++)
      for (var i = 0; i < nodes.length; i++)
        for (var j = 0; j < nodes.length; j++) {
          var pk = nodes[k];
          var pi = nodes[i];
          var pj = nodes[j];
          if (dist[pi.x+","+pi.y+"-"+pj.x+","+pj.y] > dist[pi.x+","+pi.y+"-"+pk.x+","+pk.y] + dist[pk.x+","+pk.y+"-"+pj.x+","+pj.y]) {
            dist[pi.x+","+pi.y+"-"+pj.x+","+pj.y] = dist[pi.x+","+pi.y+"-"+pk.x+","+pk.y] + dist[pk.x+","+pk.y+"-"+pj.x+","+pj.y]
            this.next[pi.x+","+pi.y+"-"+pj.x+","+pj.y] = this.next[pi.x+","+pi.y+"-"+pk.x+","+pk.y]
          }
    }
  }	
}

