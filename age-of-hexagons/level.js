
function resizeArray(arr, newSize, createFunction) {
    if (newSize > arr.length) {
        while (newSize > arr.length) {
            arr.push(createFunction());
        }
    } else {
        arr.length = newSize;
    }
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

    refresh() {
        var mapWidth = (parseInt(this.level_width) - 1) * graphicConstants.tileWidth * 0.75 * globalscale;
        var mapHeight = this.level_heigth * graphicConstants.tileHeight * globalscale;
        globalxoff = ((c.width - mapWidth) / 2) / globalscale;
        globalyoff = ((c.height - mapHeight) / 2) / globalscale;
    }

    outOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.level_width || y >= this.level_heigth;
    }

    resize(new_width, new_heigth) {
        this.level_width = new_width;
        this.level_heigth = new_heigth;
        resizeArray(this.tileMap, new_width, () => new Array());
        resizeArray(this.unitMap, new_width, () => new Array());
        for (var i = 0; i < new_width; i++) {
            resizeArray(this.unitMap[i], new_heigth, () => null);
            resizeArray(this.tileMap[i], new_heigth, () => null);
        }
    }

    toJson() {
        return JSON.stringify(this);
    }

    drawBorder(context) {
        for (var i = -1; i <= this.level_width; i++) {
            for (var j = -1; j <= this.level_heigth; j++) {
                if (i == -1 || j == -1 || i == this.level_width || j == this.level_heigth) {
                    drawImage(context, theme.disabled, i, j);
                }
            }
        }
    }

    drawTiles(context, timeNow) {
        drawBackground(context, timeNow);
        cc.lineWidth = "1";
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
                var unit = this.unitMap[i][j];
                var nation = this.tileMap[i][j]
                if (unit != null && unit != Units.Reserved) {
                    if (typeof gameMaster !== 'undefined' && gameMaster.canMoveForFree(i, j) && canMove(unit)
                        && gameMaster.currentPlayer == nation) {
                        drawImage(context, theme.unitFeet[unit], i, j);
                        var which = (timeNow / 10) % 100;
                        if (which > 50) {
                            which = 100 - which;
                        }
                        drawImage(context, theme.unitBody[unit], i, j + which * 0.002);
                    } else {
                        drawImage(context, theme.unitImg[unit], i, j);
                    }
                }
            }
        }
    }
}
