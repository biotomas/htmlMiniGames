var graphicConstants = {
    tileWidth: 80,
    tileHeight: 60
};

var playerColors = [
    "#aaaaaa",
    "#aaffc3",
    "#42d4f4",
    "#bfef45",
    "#e6beff",
    "#469990",
    "#e6a9aB",
    "#ffd8b1",
    "#fffac8",
]

// global graphics offsets (used for scrolling the map)
globalxoff = 0;
globalyoff = 0;
globalscale = 1;

// assets
bgimg = loadImage('assets/water.png');
farmImg = loadImage('assets/farm.png');
towerImg = loadImage('assets/tower.png');
townImg = loadImage('assets/town.png');
treeImg = loadImage('assets/tree.png');
peasantImg = loadImage('assets/peasant.png');
spearmanImg = loadImage('assets/spearman.png');
swordsmanImg = loadImage('assets/swordsman.png');
knightImg = loadImage('assets/knight.png');
disabledImg = loadImage('assets/disabled.png');


animationImgs = {};
animationImgs[Units.Peasant] = {};
animationImgs[Units.Spearman] = {};
animationImgs[Units.Swordsman] = {};
animationImgs[Units.Knight] = {};

for (var i = 1; i <= 6; i++) {
    animationImgs[Units.Peasant][i] = loadImage('assets/peasant' + (i > 1 ? i : '') + '.png');
    animationImgs[Units.Spearman][i] = loadImage('assets/spearman' + (i > 1 ? i : '') + '.png');
    animationImgs[Units.Swordsman][i] = loadImage('assets/swordsman' + (i > 1 ? i : '') + '.png');
    animationImgs[Units.Knight][i] = loadImage('assets/knight' + (i > 1 ? i : '') + '.png');
}

// See gameLogic.units for ordering
var unitImages = [treeImg, towerImg, townImg, farmImg, peasantImg, spearmanImg, swordsmanImg, knightImg];

function loadImage(src) {
    img = new Image;
    img.src = src;
    return img;
}

function drawBackground(cc, time) {
    xoffset = (time / 100) % 100;
    for (x = 0; x * globalscale < c.width + bgimg.width; x += bgimg.width) {
        for (y = 0; y * globalscale < c.height + bgimg.height; y += bgimg.height) {
            cc.drawImage(bgimg, x - xoffset, y - xoffset);
        }
    }
}

function scrollCanvas() {
    if (keyIsDown(65)) {
        globalxoff += 5 * globalscale;
    }
    if (keyIsDown(68)) {
        globalxoff -= 5 * globalscale;
    }
    if (keyIsDown(87)) {
        globalyoff += 5 * globalscale;
    }
    if (keyIsDown(83)) {
        globalyoff -= 5 * globalscale;
    }
    if (keypressed(82)) {
        globalscale = 1;
        currentLevel.refresh();
    }
}

function resetScale(scale) {
    cc.setTransform(scale, 0, 0, scale, 0, 0);
}

function coordsToPixels(x, y) {
    dy = 0;
    if ((x + 2) % 2 == 1) {
        dy = graphicConstants.tileHeight / 2;
    }
    return [x * graphicConstants.tileWidth * 0.75 + globalxoff, dy + y * graphicConstants.tileHeight + globalyoff];
}

function pixelsToCoords(x, y) {
    x = x / globalscale;
    y = y / globalscale;
    mx = Math.floor((x - globalxoff + graphicConstants.tileWidth / 2) / (graphicConstants.tileWidth * 0.75));
    dy = 0;
    if (mx % 2 == 1) {
        dy = graphicConstants.tileHeight / 2;
    }
    my = Math.floor((y - globalyoff - dy + graphicConstants.tileHeight / 2) / graphicConstants.tileHeight);
    return [mx, my];
}

function drawImage(cc, img, x, y) {
    pos = coordsToPixels(x, y);
    drawImagePixels(cc, img, pos[0], pos[1]);
}

function drawImagePixels(cc, img, x, y) {
    cc.drawImage(img, x - graphicConstants.tileWidth / 2 + 10,
        y - graphicConstants.tileHeight + 25, 60, 60);
}

function drawTile(cc, x, y, color) {
    pos = coordsToPixels(x, y);
    hexagonPath(cc, pos);
    cc.fillStyle = playerColors[color];
    cc.stroke();
    cc.fill();
}

function drawTileCursor(cc, x, y, time) {
    pos = coordsToPixels(x, y);
    hexagonPath(cc, pos);
    x = (time / 20) % 20;
    cc.lineDashOffset = x;
    cc.setLineDash([10, 10]);
    cc.stroke();
    cc.setLineDash([]);
}

function hexagonPath(cc, pos) {
    cc.beginPath();
    cc.moveTo(pos[0] - graphicConstants.tileWidth / 2, pos[1]);
    cc.lineTo(pos[0] - graphicConstants.tileWidth / 4, pos[1] - graphicConstants.tileHeight / 2);
    cc.lineTo(pos[0] + graphicConstants.tileWidth / 4, pos[1] - graphicConstants.tileHeight / 2);
    cc.lineTo(pos[0] + graphicConstants.tileWidth / 2, pos[1]);
    cc.lineTo(pos[0] + graphicConstants.tileWidth / 4, pos[1] + graphicConstants.tileHeight / 2);
    cc.lineTo(pos[0] - graphicConstants.tileWidth / 4, pos[1] + graphicConstants.tileHeight / 2);
    cc.closePath();
}
