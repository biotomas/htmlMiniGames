var graphicConstants = {
    tileWidth: 80,
    tileHeight: 60
};

// global graphics offsets (used for scrolling the map)
globalxoff = 0;
globalyoff = 0;
globalscale = 1;

var theme = {};
loadTheme('assets/themes/medieval', 'default');
// TODO: theme selection via UI
// loadTheme('assets/themes/nightmare', 'dark');

function loadTheme(prefix, colors) {
    
    theme.playerColors = colorThemes[colors];
    
    theme.water = loadImage(prefix + '/water.png');
    theme.disabled = loadImage(prefix + '/disabled.png');

    theme.unitImg = [];
    theme.unitBody = [];
    theme.unitFeet = [];

    // not animated
    theme.unitImg[Units.Tree] = loadImage(prefix + '/tree.svg');
    theme.unitImg[Units.Farm] = loadImage(prefix + '/farm.svg');
    theme.unitImg[Units.Tower] = loadImage(prefix + '/tower.svg');
    theme.unitImg[Units.Town] = loadImage(prefix + '/town.svg');

    // Peasant
    theme.unitImg[Units.Peasant] = loadImage(prefix + '/peasant.svg');
    theme.unitBody[Units.Peasant] = loadImage(prefix + '/peasant_body.svg');
    theme.unitFeet[Units.Peasant] = loadImage(prefix + '/peasant_feet.svg');
    
    // Spearman
    theme.unitImg[Units.Spearman] = loadImage(prefix + '/spearman.svg');
    theme.unitBody[Units.Spearman] = loadImage(prefix + '/spearman_body.svg');
    theme.unitFeet[Units.Spearman] = loadImage(prefix + '/spearman_feet.svg');
    
    // Swordsman
    theme.unitImg[Units.Swordsman] = loadImage(prefix + '/swordsman.svg');
    theme.unitBody[Units.Swordsman] = loadImage(prefix + '/swordsman_body.svg');
    theme.unitFeet[Units.Swordsman] = loadImage(prefix + '/swordsman_feet.svg');
    
    // Knight
    theme.unitImg[Units.Knight] = loadImage(prefix + '/knight.svg');
    theme.unitBody[Units.Knight] = loadImage(prefix + '/knight_body.svg');
    theme.unitFeet[Units.Knight] = loadImage(prefix + '/knight_feet.svg');

}


function loadImage(src) {
    img = new Image;
    img.src = src;
    return img;
}

function drawBackground(cc, time) {
    xoffset = (time / 100) % 100;
    for (x = 0; x * globalscale < c.width + theme.water.width; x += theme.water.width) {
        for (y = 0; y * globalscale < c.height + theme.water.height; y += theme.water.height) {
            cc.drawImage(theme.water, x - xoffset, y - xoffset);
        }
    }
}

function scrollCanvas() {
    if (keyIsDown(65)) {
        globalxoff += 5 / globalscale;
    }
    if (keyIsDown(68)) {
        globalxoff -= 5 / globalscale;
    }
    if (keyIsDown(87)) {
        globalyoff += 5 / globalscale;
    }
    if (keyIsDown(83)) {
        globalyoff -= 5 / globalscale;
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
    cc.fillStyle = theme.playerColors[color];
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
