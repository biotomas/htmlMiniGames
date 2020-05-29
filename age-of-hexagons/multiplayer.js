
function syncSend(message) {
    var ajaxRequest = new XMLHttpRequest();    
    ajaxRequest.open("POST", "http://localhost/htmlMiniGames/age-of-hexagons/server/hexas.php", false);
    //ajaxRequest.open("POST", "http://localhost/hexas/hexas.php", false);
    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxRequest.send(message);
    return ajaxRequest.responseText;
}

function hostNewGame() {
    var gameId = syncSend("op=host");
    return gameId;
}

function joinTheGame(gameId) {
    var playerId = syncSend("op=join&gid=" + gameId);
    return playerId;
}

function setLevel(gameId, mapId) {
    syncSend("op=setLobby&gid=" + gameId + "&col=mapId&val=" + mapId);
}

function setName(gameId, nameId, name) {
    syncSend("op=setLobby&gid=" + gameId + "&col=name" + nameId + "&val='" + name + "'");
}

function getLobbyData(gameId) {
    return JSON.parse(syncSend("op=getLobby&gid=" + gameId));
}

function getMoves(gameId, step) {
    var moves = JSON.parse(syncSend("op=get&gid=" + gameId + "&step=" + step));
    var result = new Array();
    for (let move of moves) {
        var parts = move.move.split(";");
        var op = parts[0];
        if (op == "go") {
            result.push({
                "op": op, "fx": parseInt(parts[1]),
                "fy": parseInt(parts[2]), "tx": parseInt(parts[3]), "ty": parseInt(parts[4])
            });
        }
        if (op == "build") {
            result.push({
                "op": op, "what": parseInt(parts[1]),
                "tx": parseInt(parts[2]), "ty": parseInt(parts[3])
            });
        }
        if (op == "endTurn") {
            result.push({ "op": op });
        }
    }
    return result;
}

function sendMove(gameId, step, fromx, fromy, tox, toy) {
    var move = "go;" + fromx + ";" + fromy + ";" + tox + ";" + toy;
    syncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
}

function sendBuild(gameId, step, what, tox, toy) {
    var move = "build;" + what + ";" + tox + ";" + toy;
    syncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
}

function sendEndTurn(gameId, step) {
    var move = "endTurn";
    syncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
}

