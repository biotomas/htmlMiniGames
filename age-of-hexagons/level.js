var constants = {
    level_width: 200,
    level_heigth: 200
}



class Level {

    constructor() {
        this.unitMap = new Array(constants.level_width);
        this.tileMap = new Array(constants.level_width);
        for (var i = 0; i < constants.level_width; i++) {
            this.unitMap[i] = new Array(constants.level_heigth);
            this.tileMap[i] = new Array(constants.level_heigth);
        }
        this.loadDefaultMap();
    };

    loadDefaultMap() {
        for (var i = 1; i < 10; i++) {
            for (var j = 1; j < 10; j++) {
                this.tileMap[i][j] = 1 + (j % 8);
            }
        }
    }

    draw(context, timeNow) {
        drawBackground(context, timeNow);

        // draw tiles
        for (var i = 0; i < constants.level_width; i++) {
            for (var j = 0; j < constants.level_heigth; j++) {
                if (this.tileMap[i][j] != null) {
                    drawTile(context, i, j, this.tileMap[i][j]);
                }
            }
        }

        // draw units
        for (var i = 0; i < constants.level_width; i++) {
            for (var j = 0; j < constants.level_heigth; j++) {
                if (this.unitMap[i][j] != null) {
                    drawImage(context, unitImages[this.unitMap[i][j]], i, j);
                }
            }
        }



    }
}
