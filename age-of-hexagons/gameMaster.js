class GameMaster {

    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.currentPlayer = 1;
        this.playerStates = new Array(players + 1);
        for (var pi = 0; pi <= players; pi++) {
            this.playerStates[pi] = new PlayerState();
            this.playerStates[pi].tiles = this.countUnits(pi, null);
            for (var unit = 1; unit < 8; unit++) {
                this.playerStates[pi].unitCount[unit] = this.countUnits(pi, unit);
            }
        }
    }

    countUnits(player, unit) {
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        var count = 0;
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == player && units[x][y] == unit) {
                    count++;
                }
            }
        }
        return count;
    }

    canEnterWithUnit(player, unit, x, y) {
        return (this.level.tileMap[x][y] == player && !this.level.unitMap[x][y])
            || (this.level.tileMap[x][y] != player
                && this.defense(player, x, y) <= GamePlayConstants.attack[unit])
    }

    canMoveUnit(player, fromx, fromy, tox, toy) {
        var state = this.playerStates[player];
        var unit = this.level.unitMap[x][y];
        return state.moves > 0
            && this.currentPlayer == player
            && this.level.tileMap[fromx][fromy] == player
            && this.canEnterWithUnit(player, unit, tox, toy)
            && this.distanceBelow(fromx, fromy, tox, toy, GamePlayConstants.range[unit]);
    }

    defense(player, x, y) {
        var maxDefense = 0;
        var level = this.level;
        for (let nb of getNeighbouringHexas(x, y)) {
            if (!level.outOfBounds(nb.x, nb.y)) {
                var unit = level.unitMap[nb.x][nb.y];
                if (level.tileMap[nb.x][nb.y] != player && unit != null) {
                    console.log("defends ", unit);
                    maxDefense = Math.max(maxDefense, GamePlayConstants.defense[unit]);
                }
            }
        }
        console.log("defense x,y,val: ", x,y, maxDefense);
        return maxDefense;
    }

    distanceBelow(fromx, fromy, tox, toy, distance) {
        for (let node of getReachableNodes(this.level, fromx, fromy, distance)) {
            if (node.x == tox && node.y == toy) {
                return true;
            }
        }
        return false;
    }

    moveUnit(player, fromx, fromy, tox, toy) {
        if (!this.canMoveUnit(player, fromx, fromy, tox, toy)) {
            console.error("Invalid move");
        }
        var state = this.playerStates[player];
        var goalPlayer = this.level.tileMap[tox][toy];
        var goalUnit = this.level.unitMap[tox][toy];
        // cutting a tree
        if (goalUnit == Units.Tree) {
            state.money += GamePlayConstants.cutTreeBonus;
        }
        // entering foreign territory
        if (goalPlayer != player) {
            state.tiles++;
            state.money += GamePlayConstants.conquerTileBonus;
            this.playerStates[goalPlayer].tiles--;
            if (goalUnit != null) {
                this.playerStates[goalPlayer].units[goalUnit]--;
            }
            //TODO cutting up enemy territory
        }
        // implement the move
        this.level.tileMap[tox][toy] = player;
        this.level.unitMap[tox][toy] = this.level.unitMap[fromx][fromy];
        this.level.unitMap[fromx][fromy] = null;
        state.moves--;
    }

    canBildUnit(player, x, y, unit) {
        var state = this.playerStates[player];
        return state.moves > 0
            && this.level.tileMap[x][y] == player
            && this.level.unitMap[x][y] == null
            && state.money >= GamePlayConstants.cost[unit];
    }

    buildUnit(player, x, y, unit) {
        if (this.canBildUnit(player, x, y, unit)) {
            this.level.unitMap[x][y] = unit;
            var state = this.playerStates[player];
            state.unitCount[unit]++;
            state.moves--;
            state.tiles--;
            state.money -= GamePlayConstants.cost[unit];
        } else {
            console.error("Invalid build");
        }
    }

    endTurn(player) {
        if (this.currentPlayer != player) {
            console.error("Invalid end of turn");
        }
        this.playerStates[player].moves = GamePlayConstants.movesPerTurn;
        this.currentPlayer = this.currentPlayer + 1;
        if (this.currentPlayer > this.players) {
            //end of global turn
            this.growTrees();
            this.currentPlayer = 1;
        }
        return this.currentPlayer;
    }

    growTrees() {
        //TODO
        console.log("Trees will grow");
    }
}
