
class MultiplayerServer {

    constructor(serverName) {
        if (serverName == "tomas-HP-ProBook-4330s") {
            // my linux laptop
            this.maxFps = 10;
            this.serverUrl = "http://localhost/aoh/server.php";
        } else if (serverName == "TODO") {
            // my windows laptop
            this.maxFps = 60;
            this.serverUrl = "http://localhost/htmlMiniGames/age-of-hexagons/server.php";
        } else {
            // freelunch.eu
            this.maxFps = 60;
            this.serverUrl = "http://freelunch.eu/age-of-hexagons/server.php";
        }
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
            if (this.readyState == 4 && this.status == 200 && callback != null) {
                callback(this.responseText);
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

