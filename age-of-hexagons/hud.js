hudx = 10;
hudy = 10;
hudHeigth = 65;
hudPerPlayer = 80;

function checkEndTurnPressed() {
    if (multiPlayerGame && gameMaster.currentPlayer != localPlayer) {
        return false;
    }
    //hudx + 5 + playerIndex * hudPerPlayer, hudy + hudHeigth + 5, hudPerPlayer, 20);
    var buttonx = hudx + 5 + gameMaster.currentPlayer * hudPerPlayer;
    var buttony = hudy + hudHeigth + 5;
    if (mousex >= buttonx && mousex <= buttonx + hudPerPlayer - 10 &&
        mousey >= buttony && mousey <= buttony + 20 && keypressed('leftMouse')) {
        return true;
    }
    return false;
}

function drawHud(cc) {
    hudWidth = hudPerPlayer + hudPerPlayer * gameMaster.players;

    cc.beginPath();
    cc.lineWidth = "1";
    cc.strokeStyle = "black";
    cc.fillStyle = "#eee";
    cc.rect(hudx, hudy, hudWidth, hudHeigth);
    cc.stroke();
    cc.fill();

    cc.fillStyle = "black";
    cc.font = "15px Arial";
    cc.fillText("Player", hudx + 5, hudy + 15);
    cc.fillText("Income ", hudx + 5, hudy + 30);
    cc.fillText("Money ", hudx + 5, hudy + 45);
    cc.fillText("Turns ", hudx + 5, hudy + 60);

    for (var playerIndex = 1; playerIndex <= gameMaster.players; playerIndex++) {
        cc.beginPath();
        cc.lineWidth = "1";
        cc.strokeStyle = playerColors[playerIndex];
        cc.fillStyle = playerColors[playerIndex];
        cc.rect(hudx + playerIndex * hudPerPlayer, hudy, hudPerPlayer, hudHeigth);
        cc.stroke();
        cc.fill();
        cc.fillStyle = "black";
        cc.strokeStyle = "black";

        if (gameMaster.currentPlayer == playerIndex &&
            (!multiPlayerGame || localPlayer == playerIndex)) {
            // end turn button
            cc.beginPath();
            cc.lineWidth = "1";
            cc.strokeStyle = "black";
            cc.fillStyle = "#ddd";
            cc.rect(hudx + 5 + playerIndex * hudPerPlayer, hudy + hudHeigth + 5,
                hudPerPlayer - 10, 20);
            cc.stroke();
            cc.fill();
            cc.fillStyle = "black";
            cc.fillText("End Turn", hudx + 10 + playerIndex * hudPerPlayer, hudy + hudHeigth + 20);
        }
        if (gameMaster.currentPlayer == playerIndex) {
            cc.font = "bold 15px Arial";
        } else {
            cc.font = "15px Arial";
        }
        cc.fillText(playerNames[playerIndex], hudx + 5 + playerIndex * hudPerPlayer, hudy + 15);
        if (gameMaster.playerStates[playerIndex].unitCount[Units.Town] == 0) {
            cc.lineWidth = "1";
            cc.strokeStyle = "black";
            cc.beginPath();
            cc.moveTo(hudx + playerIndex * hudPerPlayer, hudy + 10);
            cc.lineTo(hudx - 5 + (playerIndex + 1) * hudPerPlayer, hudy + 10);
            cc.stroke();
        }
        cc.font = "15px Arial";
        var income = gameMaster.playerStates[playerIndex].getIncome();
        if (income > 0) {
            cc.fillStyle = "green";
            income = "+" + income;
        } else {
            cc.fillStyle = "red";
        }
        cc.fillText(income, hudx + 5 + playerIndex * hudPerPlayer, hudy + 30);
        cc.fillStyle = "black";
        cc.fillText(gameMaster.playerStates[playerIndex].money, hudx + 5 + playerIndex * hudPerPlayer, hudy + 45);
        cc.fillText(gameMaster.playerStates[playerIndex].moves, hudx + 5 + playerIndex * hudPerPlayer, hudy + 60);

    }



}