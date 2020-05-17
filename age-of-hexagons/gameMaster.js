class GameMaster {

    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.currentPlayer = 1;
        this.playerStates = new Array(players + 1);
        for (var pi = 0; pi <= players; pi++) {
            this.playerStates[pi] = new PlayerState();
            this.playerStates[pi].tiles = this.countTiles(pi) - this.countUnits(pi, Units.Tree);
            for (var unit = 1; unit < 8; unit++) {
                this.playerStates[pi].unitCount[unit] = this.countUnits(pi, unit);
            }
        }
    }

    countTiles(player) {
        var tiles = this.level.tileMap;
        var count = 0;
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == player) {
                    count++;
                }
            }
        }
        return count;
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
        if (this.level.tileMap[x][y] == player) {
            var goalUnit = this.level.unitMap[x][y];
            return goalUnit == null || goalUnit == Units.Tree || canMove(goalUnit);
        } else {
            return this.defense(player, x, y) <= GamePlayConstants.attack[unit];
        }
    }

    canMoveUnit(player, fromx, fromy, tox, toy) {
        var state = this.playerStates[player];
        var unit = this.level.unitMap[fromx][fromy];
        return state.moves > 0
            && (fromx != tox || fromy != toy)
            && this.currentPlayer == player
            && this.level.tileMap[fromx][fromy] == player
            && this.canEnterWithUnit(player, unit, tox, toy)
            && this.distanceBelow(fromx, fromy, tox, toy, GamePlayConstants.range[unit]);
    }

    defense(player, x, y) {
        var maxDefense = 0;
        var level = this.level;
        var area = getNeighbouringHexas(x, y);
        if (level.unitMap[x][y] != null) {
            maxDefense = GamePlayConstants.defense[level.unitMap[x][y]];
        }
        for (let nb of area) {
            if (!level.outOfBounds(nb.x, nb.y)) {
                var unit = level.unitMap[nb.x][nb.y];
                if (level.tileMap[nb.x][nb.y] != player && unit == Units.Tower) {
                    maxDefense = Math.max(maxDefense, GamePlayConstants.defense[unit]);
                }
            }
        }
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
        var thisUnit = this.level.unitMap[fromx][fromy];
        var goalUnit = this.level.unitMap[tox][toy];
        // cutting a tree
        if (goalUnit == Units.Tree) {
            state.money += GamePlayConstants.cutTreeBonus;
            state.tiles++;
        }
        // entering foreign territory
        if (goalPlayer != player) {
            this.level.tileMap[tox][toy] = player;
            state.tiles++;
            state.money += GamePlayConstants.conquerTileBonus;
            this.playerStates[goalPlayer].tiles--;
            // killing/destroying enemy unit
            if (goalUnit != null && goalPlayer > 0) {
                this.playerStates[goalPlayer].unitCount[goalUnit]--;
            }
            for (let n of getNeighbourTiles(this.level, tox, toy)) {
                var owner = this.level.tileMap[n.x][n.y];
                if (owner == 0 || owner == player) {
                    continue;
                }
                var reachables = allRaeachableWithinNation(this.level, n.x, n.y);
                var townFound = false;
                for (let r of reachables) {
                    if (this.level.unitMap[r.x][r.y] == Units.Town) {
                        townFound = true;
                        break;
                    }
                }
                if (townFound) {
                    continue;
                }
                // a territory without a town, all unit die
                for (let r of reachables) {
                    var unitToDie = this.level.unitMap[r.x][r.y];
                    if (unitToDie != null) {
                        this.level.unitMap[r.x][r.y] = null;
                        this.playerStates[goalPlayer].unitCount[unitToDie]--;
                    }
                }
            }
        }
        // merging units
        if (goalPlayer == player && canMove(goalUnit)) {
            var mergedUnit = mergeUnits(goalUnit, thisUnit);
            state.unitCount[goalUnit]--;
            state.unitCount[thisUnit]--;
            state.unitCount[mergedUnit]++;
            this.level.unitMap[tox][toy] = mergedUnit;
        } else {
            // moving unit
            this.level.unitMap[tox][toy] = thisUnit;
        }
        this.level.tileMap[tox][toy] = player;
        this.level.unitMap[fromx][fromy] = null;
        state.moves--;
        if (state.moves == 0) {
            this.endTurn(this.currentPlayer);
        }
    }

    canAfford(unit) {
        var money = this.playerStates[this.currentPlayer].money;
        return money >= GamePlayConstants.cost[unit];
    }

    canBuildUnit(player, x, y, unit) {
        var state = this.playerStates[player];
        return state.moves > 0
            && this.level.tileMap[x][y] == player
            && this.level.unitMap[x][y] == null
            && state.money >= GamePlayConstants.cost[unit];
    }

    buildUnit(player, x, y, unit) {
        if (this.canBuildUnit(player, x, y, unit)) {
            this.level.unitMap[x][y] = unit;
            var state = this.playerStates[player];
            state.unitCount[unit]++;
            state.moves--;
            state.money -= GamePlayConstants.cost[unit];
            if (state.moves == 0) {
                this.endTurn(this.currentPlayer);
            }
        } else {
            console.error("Invalid build");
        }
    }

    endTurn(player) {
        if (this.currentPlayer != player) {
            console.error("Invalid end of turn");
        }
        this.playerStates[player].endTurn();
        if (this.playerStates[player].money <= 0) {
            this.killAllUnits(player);
        }
        this.currentPlayer = this.currentPlayer + 1;
        if (this.currentPlayer > this.players) {
            //end of global turn
            this.growTrees();
            this.currentPlayer = 1;
        }
        return this.currentPlayer;
    }

    killAllUnits(player) {
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == player && canMove(units[x][y])) {
                    units[x][y] = null;
                }
            }
        }
        this.playerStates[player].unitCount[Units.Peasant] = 0;
        this.playerStates[player].unitCount[Units.Swordsman] = 0;
        this.playerStates[player].unitCount[Units.Spearman] = 0;
        this.playerStates[player].unitCount[Units.Knight] = 0;
        this.playerStates[player].money = 10;
    }

    growTrees() {
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == null) {
                    continue;
                }
                var rnd = Math.random();
                // possibly spawn a tree from a tree
                if (units[x][y] == Units.Tree && rnd < GamePlayConstants.treeReproduceProbability) {
                    for (let neigh of getNeighbouringHexas(x, y)) {
                        if (!this.level.outOfBounds(neigh.x, neigh.y)
                            && tiles[neigh.x][neigh.y] != null
                            && units[neigh.x][neigh.y] == null) {
                            this.addTree(neigh.x, neigh.y);
                            break;
                        }
                    }
                }
                // possibly spawn a tree from nothing
                if (units[x][y] == null && rnd < GamePlayConstants.treeSpawnProbability) {
                    this.addTree(x, y);
                }
            }
        }
    }

    addTree(x, y) {
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        units[x][y] = Units.Tree;
        if (tiles[x][y] > 0) {
            this.playerStates[tiles[x][y]].tiles--;
        }
    }
}
