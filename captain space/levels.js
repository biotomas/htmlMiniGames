var map = [];

box = new Image;
destr = new Image;
coin = new Image;
grid = new Image;

function loadMap() {
	map = [
"111111111111111111111111111111111111111111111111111111",
"1                                                    1",
"1        11111                11111111               1",
"1                          3                         1",
"1                         3 3                        1",
"1    22222  1111111111   3 3 3         11111111111   1",
"1                                      22            1",
"1                       111111111      22 3 3 3 3    1",
"1                                      22  3 3 3     1",
"1   11111111111111111                  22 3 3 3 3    1",
"1                         1111111111111111           1",
"1                                                    1",
"111111111111111111111111111111111111111111111111111111"
	];
	box.src = 'resources/boxAlt.png';
	destr.src = 'resources/boxCoin.png';
	coin.src = 'resources/coinGold.png';
	grid.src = 'resources/grid.png';
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function level_collect(ln,col) {
	if (map[ln].charAt(col)=="3") {
		//TODO optimize this nasty string manipulation
		map[ln] = map[ln].substr(0,col) + " " + map[ln].substr(col+1);
		return 3;
	}
}

function level_canPass(col, ln) {
	//console.log("can pass?:",col,ln);
	// if out ouf range
	if (col < 0 || ln < 0 || ln >= map.length || col >= map[0].lenght) {
		return false;
	}
	return map[ln].charAt(col)==" " || map[ln].charAt(col)=="3";
}

function level_draw(cc) {
	//TODO optimize to not draw invisible parts of the map by moding the for loop start and end
	for (ln = 0; ln < map.length; ln++) {
		line = map[ln];
		for (col = 0; col < line.length; col++) {
			if (map[ln].charAt(col)=="1") {
				cc.drawImage(box,col*70 - hero.x + camx, ln*70 - hero.y + camy);
			}			
			if (map[ln].charAt(col)=="2") {
				cc.drawImage(destr,col*70 - hero.x + camx, ln*70 - hero.y + camy);
			}			
			if (map[ln].charAt(col)=="3") {
				cc.drawImage(coin,col*70 - hero.x + camx, ln*70 - hero.y + camy);
			}
			/*			
			if (map[ln].charAt(col)==" ") {
				cc.drawImage(grid,col*70 - hero.x + camx, ln*70 - hero.y + camy);
			}			
			/*
			cc.fillStyle="white";
			cc.font="10px Arial";
			cc.fillText("(".concat(col,",",ln,")"), col*70 - hero.x + camx+25, ln*70 - hero.y + camy+35);
			/**/
		}
	}
	/**/
	
}

