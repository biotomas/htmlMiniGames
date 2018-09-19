var hero = {
	canJump:0,
	lastJump:0,
	isWalking:false,
	isFlying:true,
	facing:0, //-1,0,1 : left, middle, right
	score:0,
	x:100,
	y:300,
	v:0
};

var heroWalk = [];
var heroWalkLeft = [];
var	heroStand = new Image;
var heroJumpLeft = new Image;
var heroJumpRight = new Image;

function hero_initialize() {
	hero.canJump = consts.heroJumps;
	
	heroStand.src = 'resources/p1_front.png';
	heroJumpLeft.src = 'resources/fp1_jump.png';
	heroJumpRight.src = 'resources/p1_jump.png';
	
	for (i=1; i < 10; i++) {
		heroWalk[i] = new Image;
		heroWalk[i].src = 'resources/walk/p1_walk0'+i+'.png'
		heroWalkLeft[i] = new Image;
		heroWalkLeft[i].src = 'resources/walk/fp1_walk0'+i+'.png'
	}
	heroWalk[10] = new Image;
	heroWalk[10].src = 'resources/walk/p1_walk10.png'
	heroWalk[11] = new Image;
	heroWalk[11].src = 'resources/walk/p1_walk11.png'
	heroWalkLeft[10] = new Image;
	heroWalkLeft[10].src = 'resources/walk/fp1_walk10.png'
	heroWalkLeft[11] = new Image;
	heroWalkLeft[11].src = 'resources/walk/fp1_walk11.png'
}

function hero_update(tfr) {
	// future position	
	fx = hero.x;
	fy = hero.y;

	// left-right movement
	if (keyState[16]) speed=consts.heroSpeedSprint; else speed=consts.heroSpeedNormal;
	movedelta = Math.min(tfr*speed, consts.gridSize); // to not go through wall at low fps
	if (keyState[65]) {
		fx = hero.x - movedelta;
		hero.facing = -1;
	}
	if (keyState[68]) {
		fx = hero.x + movedelta;
		hero.facing = 1;
	}
	// jumping
	d = new Date();
	tnow = d.getTime();
	if (keyState[32] && hero.canJump > 0 && hero.lastJump + consts.heroJumpsInterval < tnow) {
		hero.canJump--;
		hero.lastJump = tnow;
		hero.v = consts.heroJumpVel;		
	}

	// laser
	if (keyState['mouse']) {
		vx = mousex - camx;
		vy = mousey - camy;
		projectile_laserOn(hero.x,hero.y,vy/vx);
	} else {
		projectile_laserOff();
	}

	// shooting
	if (keyState['mouse'] && projectile_canShoot()) {
		vx = mousex - camx;
		vy = mousey - camy;
		amp = Math.max(Math.abs(vx),Math.abs(vy));
		projectile_add(hero.x,hero.y,consts.shotSpeed*vx/amp,consts.shotSpeed*vy/amp);
	}

	// falling/flying
	hero.v += tfr*consts.gravity;
	fy = hero.y + Math.min(tfr*hero.v, consts.gridSize); // to not go through walls at low fps

	// collecting map items
	// TODO collect with the entire body, not only middle
	col = Math.floor((fx+consts.heroWidth/2)/consts.gridSize);
	ln = Math.floor((fy+consts.heroHeight/2)/consts.gridSize);
	reward = level_collect(ln,col);
	if (reward) {
		snd.play();
		snd.currentTime=0;
		console.log("collected ",reward);
		hero.score += reward;
	}


	hero.isWalking = false;
	hero.isFlying = false;
	// ================ Collisions with the map ============== //
	if (fy < hero.y) {// flying upwards
		// hitting head
		if (collides(hero.x, fy) || collides(hero.x+consts.heroWidth, fy)) {
			fy = hero.y;
			hero.v = 0.1;
		}
	} else {// falling
		// hitting ground while falling
		if (collides(hero.x, fy + consts.heroHeight) || collides(hero.x+consts.heroWidth, fy + consts.heroHeight)) {
			fy = Math.floor((fy+consts.heroHeight)/consts.gridSize)*consts.gridSize-consts.heroHeight;
			//console.log(fy, hero.y);
			//fy = hero.y;
			hero.v = 0;
			hero.lastJump = 0;
			hero.canJump = consts.heroJumps;
			if (hero.x != fx) {
				hero.isWalking = true;
			}
		}
	}

	if (fx < hero.x) {//going left
		if (collides(fx, fy-1) || collides(fx, fy + consts.heroHeight/2 - 1) || collides(fx, fy + consts.heroHeight -1)) {
			fx = hero.x;
		}
	} else if (fx > hero.x) {//going right
		if (collides(fx+consts.heroWidth,fy-1) || collides(fx+consts.heroWidth, fy + consts.heroHeight/2-1) || collides(fx+consts.heroWidth,fy + consts.heroHeight -1)) {
			fx = hero.x;
		}
	}
	hero.isFlying = hero.y != fy;
	hero.x = fx;
	hero.y = fy;
}

function collides(x,y) {
	col = Math.floor(x/consts.gridSize);
	ln = Math.floor(y/consts.gridSize);
	return !level_canPass(col,ln);
}

function hero_draw(cc) {
	if (hero.isWalking) {
		d = new Date();
		tnow = d.getTime();
		ind = Math.floor((tnow/50) % 11)+1;
		if (hero.facing == 1) {
			cc.drawImage(heroWalk[ind],0+camx,0+camy);
		} else {
			cc.drawImage(heroWalkLeft[ind],0+camx,0+camy);
		}
	} else if (hero.isFlying) {
		if (hero.facing == 1) {
			cc.drawImage(heroJumpRight,0+camx,0+camy);
		} else {
			cc.drawImage(heroJumpLeft,0+camx,0+camy);
		}
	} else {
		cc.drawImage(heroStand,0+camx,0+camy);
	}
}

