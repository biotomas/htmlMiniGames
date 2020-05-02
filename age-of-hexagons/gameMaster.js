class GameMaster {

    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.currentPlayer = 1;
        this.playerStates = new Array(players+1);
        for (var pi = 1; pi <= players; pi++) {
            this.playerStates[pi] = new PlayerState();
            this.playerStates[pi].farms = countUnits(pi, Units.Farm);
            this.playerStates[pi].tiles = 0;//TODO
            this.playerStates[pi].towns = 0;
            this.playerStates[pi].peasants = 0;
            this.playerStates[pi].spearmen = 0;
            this.playerStates[pi].swordsmen = 0;
            this.playerStates[pi].knights = 0;
    
        }
    }

    countUnits(player, unit) {
        //TODO
    }

    moveUnit(player, fromx, fromy, tox, toy) {
        // check if the move is possible
        if (this.level.tileMap[fromx][fromy] != player) {
            fail("cannot move from foreign tile");
            return false;
        }

        // implement the move
    }

    buildUnit(player, x, y) {
        // check if possible

        // implement
    }
}

function fail(msg) {
    console.log(msg);
}