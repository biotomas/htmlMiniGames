hudWidth = 540;
hudHeigth = 130;
hudx = 0;
hudy = 0;
hudActive = false;
buildUnit = 0;
buildUnitSelected = 0;
buildMenuEnabled = false;

function updateBuildMenu() {
    if (!buildMenuEnabled) {
        hudActive = false;
        buildUnit = 0;
        buildUnitSelected = 0;
        return;
    }
    hudx = (c.width - hudWidth) / 2;
    hudy = c.height - hudHeigth -10;

    if (mousex > hudx && mousex < hudx + hudWidth && mousey > hudy && mousey < hudy + hudHeigth) {
        hudActive = true;
        lx = mousex - hudx;
        if (lx < 240) {
            buildUnit = 1 + Math.floor((lx)/80);
        } else if (lx > 280) {
            buildUnit = 4 + Math.floor((lx-280)/60);
        } else {
            buildUnit = 0;
        }
        if (keyState['leftMouse']) {
            buildUnitSelected = buildUnit;
        }
    } else {
        buildUnit = 0;
        hudActive = false;
    }
}

function drawBuildMenu(cc) {
    if (!buildMenuEnabled) {
        return;
    }
    cc.beginPath();
    if (hudActive) {
        cc.lineWidth = "5";
    } else {
        cc.lineWidth = "1";
    }
    cc.strokeStyle = "black";
    cc.fillStyle = "gray";
    cc.rect(hudx, hudy, hudWidth, hudHeigth);
    cc.stroke();
    cc.fill();
    for (var unit = 1; unit <= 3; unit++) {
        
        cc.drawImage(unitImages[unit], hudx + (unit-1)*80, hudy + 30 + (unit == buildUnit ? -8 : 0));
    }
    for (var unit = 4; unit <= 7; unit++) {
        cc.drawImage(unitImages[unit], hudx + 280 + (unit-4)*60, hudy + 30 + (unit == buildUnit ? -8 : 0));
    }
    
    cc.fillStyle = "black";
    cc.font = "20px Arial";
    cc.fillText("Build ", hudx+110, hudy+20);
    cc.fillText("Train ", hudx+390, hudy+20);
    cc.font = "16px Arial";
}
