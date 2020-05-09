menuWidth = 540;
menuHeigth = 130;
menux = 0;
menuy = 0;
menuActive = false;
buildUnit = 0;
buildUnitSelected = 0;
buildMenuEnabled = false;

function updateBuildMenu() {
    if (!buildMenuEnabled) {
        menuActive = false;
        buildUnit = 0;
        buildUnitSelected = 0;
        return;
    }
    menux = (c.width - menuWidth) / 2;
    menuy = c.height - menuHeigth -10;

    if (mousex > menux && mousex < menux + menuWidth && mousey > menuy && mousey < menuy + menuHeigth) {
        menuActive = true;
        lx = mousex - menux;
        if (lx < 240) {
            buildUnit = 1 + Math.floor((lx)/80);
        } else if (lx > 280) {
            buildUnit = 4 + Math.floor((lx-280)/60);
        } else {
            buildUnit = 0;
        }
        if (keypressed('leftMouse') && gameMaster.canAfford(buildUnit)) {
            state = States.BUILD;
            unitToBuild = buildUnit;
            buildMenuEnabled = false;
        }
    } else {
        buildUnit = 0;
        menuActive = false;
        if (keypressed('leftMouse')) {
            state = States.IDLE;
            unitToBuild = buildUnit;
            buildMenuEnabled = false;
        }
    }
}

function drawBuildMenu(cc) {
    if (!buildMenuEnabled) {
        return;
    }
    cc.beginPath();
    if (menuActive) {
        cc.lineWidth = "5";
    } else {
        cc.lineWidth = "1";
    }
    cc.strokeStyle = "black";
    cc.fillStyle = "gray";
    cc.rect(menux, menuy, menuWidth, menuHeigth);
    cc.stroke();
    cc.fill();
    for (var unit = 1; unit <= 3; unit++) {
        if (gameMaster.canAfford(unit)) {
            cc.globalAlpha = 1;
        } else {
            cc.globalAlpha = 0.2;
        }
        cc.drawImage(unitImages[unit], menux + (unit-1)*80, menuy + 30 + (unit == buildUnit ? -8 : 0));
    }
    for (var unit = 4; unit <= 7; unit++) {
        if (gameMaster.canAfford(unit)) {
            cc.globalAlpha = 1;
        } else {
            cc.globalAlpha = 0.2;
        }
        cc.drawImage(unitImages[unit], menux + 280 + (unit-4)*60, menuy + 30 + (unit == buildUnit ? -8 : 0));
    }
    cc.globalAlpha = 1;
    cc.fillStyle = "black";
    cc.font = "20px Arial";
    cc.fillText("Build ", menux+110, menuy+20);
    cc.fillText("Train ", menux+390, menuy+20);
    cc.font = "16px Arial";
}
