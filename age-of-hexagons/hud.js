hudx = 10;
hudy = 10;
hudHeigth = 65;
hudPerPlayer = 70;

function drawHud(cc) {
    hudWidth = hudPerPlayer + hudPerPlayer*gameMaster.players;

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
        if (gameMaster.currentPlayer == playerIndex) {
            cc.font = "bold 15px Arial";
        }
        cc.fillText(playerNames[playerIndex], hudx + 5 + playerIndex*hudPerPlayer, hudy + 15);
        cc.font = "15px Arial";
        var income = gameMaster.playerStates[playerIndex].getIncome();
        if (income > 0) {
            cc.fillStyle = "green";
            income = "+" + income;
        } else {
            cc.fillStyle = "red";
        }
        cc.fillText(income, hudx + 5 + playerIndex*hudPerPlayer, hudy + 30);
        cc.fillStyle = "black";
        cc.fillText(gameMaster.playerStates[playerIndex].money, hudx + 5 + playerIndex*hudPerPlayer, hudy + 45);
        cc.fillText(gameMaster.playerStates[playerIndex].moves, hudx + 5 + playerIndex*hudPerPlayer, hudy + 60);
    
    }



}