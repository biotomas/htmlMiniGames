menuWidth = 540;
menuHeigth = 130;
menux = 0;
menuy = 0;
menuActive = false;
buildUnit = 0;
buildUnitSelected = 0;
buildMenuEnabled = false;
buildMenuEditorMode = false;

function updateBuildMenu() {
    if (!buildMenuEnabled) {
        menuActive = false;
        buildUnit = 0;
        buildUnitSelected = 0;
        return;
    }
    menux = (c.width - menuWidth) / 2;
    menuy = c.height - menuHeigth - 10;

    if (mousex > menux && mousex < menux + menuWidth && mousey > menuy && mousey < menuy + menuHeigth) {
        menuActive = true;
        lx = mousex - menux;
        if (lx < 240) {
            buildUnit = 1 + Math.floor((lx) / 80);
        } else if (lx > 280) {
            buildUnit = 4 + Math.floor((lx - 280) / 60);
        } else {
            buildUnit = 0;
        }
        if (keypressed('leftMouse') && (buildMenuEditorMode || gameMaster.canAfford(buildUnit))) {
            state = States.BUILD;
            unitToBuild = buildUnit;
            buildMenuEnabled = buildMenuEditorMode;
        }
    } else if (buildMenuEditorMode) {
        menuActive = false;
    } else {
        buildUnit = null;
        menuActive = false;
        if (keypressed('leftMouse')) {
            state = States.IDLE;
            unitToBuild = buildUnit;
            buildMenuEnabled = false;
        }
    }
}

function drawTooltip(cc) {
    if (buildUnit == null || buildUnit == 0 || buildUnit > 7) {
        return;
    }
    cc.beginPath();
    cc.lineWidth = "1";
    cc.strokeStyle = "black";
    cc.fillStyle = "#eee";
    cc.rect(menux, menuy - 40, menuWidth, 35);
    cc.stroke();
    cc.fill();
    cc.font = "Bold 14px Arial";
    cc.fillStyle = "black";
    cc.fillText(UnitNames[buildUnit] + ": ", menux + 10, menuy - 25);
    var nameSize = cc.measureText(UnitNames[buildUnit]+": ").width;
    cc.font = "14px Arial";
    cc.fillText(UnitDescriptions[buildUnit], menux + 12 + nameSize, menuy - 25);
    cc.font = "Bold 14px Arial";
    cc.fillText("Purchase price: " , menux + 10, menuy - 10);
    cc.font = "14px Arial";
    cc.fillText(GamePlayConstants.cost[buildUnit] , menux + 120, menuy - 10);

    var profit = GamePlayConstants.incomes[buildUnit];
    cc.font = "Bold 14px Arial";
    var incomeText = profit > 0 ? "income per round: " : "cost per round: ";
    var incomeSize = cc.measureText(incomeText).width;
    cc.fillText(incomeText, menux + 200, menuy - 10);
    cc.font = "14px Arial";
    if (profit > 0) {
        cc.fillStyle = "green";
    } else {
        cc.fillStyle = "red";
    }
    cc.fillText(Math.abs(profit) , menux + 202 + incomeSize, menuy - 10);
}

function drawBuildMenu(cc) {
    if (!buildMenuEnabled) {
        return;
    }
    resetScale(1);
    menux = (c.width - menuWidth) / 2;
    menuy = c.height - menuHeigth - 10;
    if (menuActive) {
        cc.lineWidth = "5";
        if (buildUnit != null) {
            drawTooltip(cc);
        }
    } else {
        cc.lineWidth = "1";
    }
    cc.beginPath();
    cc.strokeStyle = "black";
    cc.fillStyle = "gray";
    cc.rect(menux, menuy, menuWidth, menuHeigth);
    cc.stroke();
    cc.fill();
    for (var unit = 1; unit <= 3; unit++) {
        if (buildMenuEditorMode || gameMaster.canAfford(unit)) {
            cc.globalAlpha = 1;
        } else {
            cc.globalAlpha = 0.2;
        }
        cc.drawImage(theme.unitImg[unit], menux + (unit - 1) * 80, menuy + 30 + (unit == buildUnit ? -8 : 0));
    }
    for (var unit = 4; unit <= 7; unit++) {
        if (buildMenuEditorMode || gameMaster.canAfford(unit)) {
            cc.globalAlpha = 1;
        } else {
            cc.globalAlpha = 0.2;
        }
        cc.drawImage(theme.unitImg[unit], menux + 280 + (unit - 4) * 60, menuy + 30 + (unit == buildUnit ? -8 : 0));
    }
    cc.globalAlpha = 1;
    cc.fillStyle = "black";
    cc.font = "20px Arial";
    cc.fillText("Build ", menux + 110, menuy + 20);
    cc.fillText("Train ", menux + 390, menuy + 20);
    cc.font = "16px Arial";
    resetScale(globalscale);
}
