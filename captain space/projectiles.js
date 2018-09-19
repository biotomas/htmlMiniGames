var shots = []
var nextShotId = 0;
var maxShots = 3;
var lastShotTime = 0;
var shotInterval = 200;
var laser = {
	on:false,
	xlen:300, // x-length
	sx:0, // start coord. x
	sy:0, // stary coord. y
	or:1, // orientation
	a:0   // angle
}

function projectile_add(sx,sy,vx,vy) {
	d = new Date();
	tnow = d.getTime();
	if (projectile_canShoot()) {
		lastShotTime = tnow;
		shots[nextShotId] = {x:sx,y:sy,vx:vx,vy:vy};
		nextShotId++;
		if (nextShotId >= maxShots)
			nextShotId = 0;
	}
}

function projectile_canShoot() {
	d = new Date();
	tnow = d.getTime();
	return tnow - lastShotTime > shotInterval;
}

function projectile_laserOn(sx,sy,ang) {
	laser.on = true;
	laser.sx = sx;
	laser.sy = sy;
	laser.a = ang;
	laser.or = vx > 0 ? 1 : -1;
}

function projectile_laserOff() {
	laser.on = false;
}

function laserX(len) {
	return len*laser.or
}

function laserY(len) {
	return len*laser.a*laser.or
}

function projectile_update(tfr) {
	d = new Date();
	tnow = d.getTime();
	for (i = 0; i < maxShots; i++) {
		if (shots[i]) {
			shots[i].x += tfr*shots[i].vx;
			shots[i].y += tfr*shots[i].vy;
		}
	}
	
	//laser collision with map
	if (laser.on) {
		//find nearest hit box horizontally
//		console.log(consts.gridSize/laser.a);
		//console.log("===");
		/*
		for (i = 1; i < 10; i++) {
			xdel = i*consts.gridSize;		
			x = laserX(xdel);
			y = laserY(xdel);
			//console.log(hero.x, hero.y, x,y);
			hx = Math.floor((x+laser.sx)/consts.gridSize);
			hy = Math.floor((y+laser.sy)/consts.gridSize);
			//console.log(hx,hy);
			if (!level_canPass(hx,hy)) {
				console.log("hit wall vert at", hx,hy);
				break;
			}
		}
		/**/

		// fired from grid
		hx = Math.floor(laser.sx/consts.gridSize);
		hy = Math.floor(laser.sy/consts.gridSize);
		// track the laser for at most 10 grids
		//for (i = 0; i < 10; i++) {
		if (laser.or < 0) {
			//shooting left
			y = laser.sy + laserY(laser.sx - hx*consts.gridSize);
			if (laser.a < 0) {
				//shooting up
				len = -(hy*consts.gridSize - laser.sy)/laser.a
			} else {
				//shooting down
				len = (laser.sy - (hy+1)*consts.gridSize)/laser.a
			}
		} else {
			//shooting right
			y = laser.sy + laserY((1+hx)*consts.gridSize - laser.sx);
			if (laser.a > 0) {
				//shooting up
				len = -(hy*consts.gridSize - laser.sy)/laser.a
			} else {
				//shooting down
				len = (laser.sy - (hy+1)*consts.gridSize)/laser.a
			}
		}
		nhy = Math.floor(y/consts.gridSize);
		nhx = Math.floor((laser.sx + len)/consts.gridSize);

console.log(hx,hy,nhx,nhy);

//console.log(laser.sx - hx*consts.gridSize, y, nhy);

//console.log(laser.sx, laser.sy, hx,hy,"y,nhy",y,nhy);

/*
			if (hy == nhy) {
				console.log("straight");
			}
			if (hy < nhy) {
				console.log("down");
			}
			if (hy > nhy) {
				console.log("up");
			}
*/
			//console.log(hx,hy, laser.a);

		//}


//TODO
		/*/find nearest hit box vertically
		for (i = 1; i < 10; i++) {
			xdel = i*consts.gridSize/laser.a;
			console.log(xdel);
			x = laserX(xdel);
			y = laserY(xdel);
			hx = Math.floor((x+laser.sx)/consts.gridSize);
			hy = Math.floor((y+laser.sy)/consts.gridSize);
			console.log(hx,hy);
			//if (!level_canPass(hx,hy)) {
				//console.log("hit wall hor at", hx,hy);
				//break;
			}/**/
	}
	/**/
}



function projectile_draw(cc) {
	// the laser
	if (laser.on) {
		cc.beginPath();
		cc.moveTo(laser.sx - hero.x + camx,laser.sy - hero.y + camy);
		cc.lineTo(laser.sx + laserX(laser.xlen) - hero.x + camx, 
							laser.sy + laserY(laser.xlen) - hero.y + camy);
		cc.lineWidth = 10;
		cc.stroke();
	}

	// the shots
	for (i = 0; i < shots.length; i++) {
		if (shots[i]) {
			cc.fillStyle="#ff0000";
			cc.beginPath();
			cc.arc(shots[i].x - hero.x + camx,shots[i].y - hero.y + camy,10,0,2*Math.PI);
			cc.fill();
		}
	}
}
