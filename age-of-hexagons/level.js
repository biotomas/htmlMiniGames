
function resizeArray(arr, newSize, defaultValue) {
    while (newSize > arr.length)
        arr.push(defaultValue);
    arr.length = newSize;
}

class Level {

    constructor(width, heigth) {
        this.level_width = width;
        this.level_heigth = heigth;
        this.unitMap = new Array(this.level_width);
        this.tileMap = new Array(this.level_width);
        for (var i = 0; i < this.level_width; i++) {
            this.unitMap[i] = new Array(this.level_heigth);
            this.tileMap[i] = new Array(this.level_heigth);
        }
    };

    resize(new_width, new_heigth) {
        resizeArray(this.tileMap, new_width, new Array(new_heigth));
        resizeArray(this.unitMap, new_width, new Array(new_heigth));
        for (var i = 0; i < new_width; i++) {
            resizeArray(this.unitMap[i], new_heigth, null);
            resizeArray(this.tileMap[i], new_heigth, null);
        }
        this.level_width = new_width;
        this.level_heigth = new_heigth;
    }

    toJson() {
        return JSON.stringify(this);
    }

    drawBorder(context) {
        for (var i = -1; i <= this.level_width; i++) {
            for (var j = -1; j <= this.level_heigth; j++) {
                if (i == -1 || j == -1 || i == this.level_width || j == this.level_heigth) {
                    drawImage(context, disabledImg, i, j);
                }
            }
        }


    }

    drawTiles(context, timeNow) {
        drawBackground(context, timeNow);

        // draw tiles
        for (var i = 0; i < this.level_width; i++) {
            for (var j = 0; j < this.level_heigth; j++) {
                if (this.tileMap[i][j] != null) {
                    drawTile(context, i, j, this.tileMap[i][j]);
                }
            }
        }
    }

    drawUnits(context, timeNow) {
        // draw units
        for (var i = 0; i < this.level_width; i++) {
            for (var j = 0; j < this.level_heigth; j++) {
                if (this.unitMap[i][j] != null) {
                    drawImage(context, unitImages[this.unitMap[i][j]], i, j);
                }
            }
        }



    }
}
