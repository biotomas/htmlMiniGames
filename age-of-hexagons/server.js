
class MultiplayerServer {

    constructor(serverUrl, maxFps = 60) {
        this.maxFps = maxFps;
        this.serverUrl = serverUrl + "/server.php";
        console.log("init server connection: " + this)
    }

    syncSend(message) {
        return this.send(message, false, null);
    }

    asyncSend(message) {
        // we dont care about the answer in this case
        this.send(message, true, null);
    }

    asyncSendCallback(message, callback) {
        // we dont care about the answer in this case
        this.send(message, true, callback);
    }

    send(message, asynchronnous, callback) {
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("POST", this.serverUrl, asynchronnous);
        ajaxRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 && callback != null) {
                    callback(this.responseText);
                } else {
                    if (this.status != 200) {
                        console.error("server request failed with status: ", this.status,
                        " message was ", message);
                        return;
                    }
                    if (asynchronnous && this.responseText.trim() != "OK") {
                        console.error("server request failed, response: '", 
                        this.responseText, "' message was: ", message);
                    }
                }
            }
        };
        ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajaxRequest.send(message);
        return ajaxRequest.responseText;
    }

    hostNewGame() {
        var gameId = this.syncSend("op=host");
        return gameId;
    }

    joinTheGame(gameId) {
        var playerId = this.syncSend("op=join&gid=" + gameId);
        return playerId;
    }

    setLevel(gameId, mapId) {
        this.asyncSend("op=setLobby&gid=" + gameId + "&col=mapId&val=" + mapId);
    }

    setName(gameId, nameId, name) {
        this.asyncSend("op=setLobby&gid=" + gameId + "&col=name" + nameId + "&val='" + name + "'");
    }

    refreshLobbyData(gameId) {
        this.lobbyData = null;
        this.asyncSendCallback("op=getLobby&gid=" + gameId,
            x => this.lobbyData = JSON.parse(x));
    }

    refreshMoves(gameId, step) {
        this.movesData = null;
        this.asyncSendCallback("op=get&gid=" + gameId + "&step=" + step,
            x => this.translateMoves(x));
    }

    translateMoves(response) {
        var moves = JSON.parse(response);
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
        this.movesData = result;
    }

    sendMove(gameId, step, fromx, fromy, tox, toy) {
        var move = "go;" + fromx + ";" + fromy + ";" + tox + ";" + toy;
        this.asyncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
    }

    sendBuild(gameId, step, what, tox, toy) {
        var move = "build;" + what + ";" + tox + ";" + toy;
        this.asyncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
    }

    sendEndTurn(gameId, step) {
        var move = "endTurn";
        this.asyncSend("op=move&gid=" + gameId + "&step=" + step + "&move=" + move);
    }
}

