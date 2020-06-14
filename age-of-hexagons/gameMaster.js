class GameMaster {

    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.currentPlayer = 1;
        this.playerStates = new Array(players + 1);
        this.rndState = 42; // random seed
        this.movedUnits = new Set();
        for (var pi = 0; pi <= 8; pi++) {
            this.playerStates[pi] = new PlayerState();
            this.playerStates[pi].tiles = this.countTiles(pi) - this.countUnits(pi, Units.Tree);
            for (var unit = 1; unit < 8; unit++) {
                this.playerStates[pi].unitCount[unit] = this.countUnits(pi, unit);
            }
            this.playerStates[pi].unitMoves = this.playerStates[pi].countMovingUnits();
        }
    }

    nextRnd() {
        // xorshift32 algorithm
        var a = this.rndState;
        a ^= a << 13;
        a ^= a >> 17;
        a ^= a << 5;
        this.rndState = a;
        return a;
    }

    rndTest() {
        var data = new Array(100);
        for (var i = 0; i < 100; i++) {
            data[i] = 0;
        }
        for (var i = 0; i < 100000; i++) {
            var r = this.nextRnd();
            data[r % 100]++;
        }
        for (var i = 0; i < 100; i++) {
            console.log(i, data[i]);
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
        return (state.moves > 0 || state.unitMoves > 0)
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
                if (level.tileMap[nb.x][nb.y] != player && unit != null) {
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

    moveUnit(player, fromx, fromy, tox, toy, animation) {
        if (!this.canMoveUnit(player, fromx, fromy, tox, toy)) {
            console.error("Invalid move lol");
        }
        var state = this.playerStates[player];
        var goalPlayer = this.level.tileMap[tox][toy];
        var thisUnit = this.level.unitMap[fromx][fromy];
        var goalUnit = this.level.unitMap[tox][toy];
        var to = { "x": tox, "y": toy };

        this.level.tileMap[tox][toy] = player;
        // conquering by surrounding tiles, must be done twice
        this.checkForSurroundedTiles(player, tox, toy);
        this.checkForSurroundedTiles(player, tox, toy);
        // cutting a tree
        if (goalUnit == Units.Tree) {
            state.money += GamePlayConstants.cutTreeBonus;
            state.tiles++;
            this.level.unitMap[tox][toy] = null;
            animation.addAnimation(new Animation(AnimationType.FadeOut,
                to, to, Units.Tree, thisUnit));

        }
        if (goalPlayer != player) {
            this.takeTerritory(tox, toy, goalPlayer, player, true);
        }
        // merging units
        if (goalPlayer == player && canMove(goalUnit)) {
            var mergedUnit = mergeUnits(goalUnit, thisUnit);
            state.unitCount[goalUnit]--;
            state.unitCount[thisUnit]--;
            state.unitCount[mergedUnit]++;
            animation.addAnimation(new Animation(AnimationType.Move,
                { "x": fromx, "y": fromy }, { "x": tox, "y": toy }, thisUnit, mergedUnit));
        } else {
            // moving unit
            this.movedUnits.add(tox + ":" + toy);
            animation.addAnimation(new Animation(AnimationType.Move,
                { "x": fromx, "y": fromy }, { "x": tox, "y": toy }, thisUnit, thisUnit));
        }
        if (this.canMoveForFree(fromx, fromy)) {
            state.unitMoves--;
        } else {
            state.moves--;
        }
        this.level.unitMap[fromx][fromy] = null;
        this.movedUnits.delete(fromx + ":" + fromy);
    }

    takeTerritory(x, y, oldOwner, newOwner, kill) {
        var state = this.playerStates[newOwner];
        var enemyState = this.playerStates[oldOwner];
        var enemyUnit = this.level.unitMap[x][y];
        this.level.tileMap[x][y] = newOwner;
        state.tiles++;
        enemyState.tiles--;
        state.money += GamePlayConstants.conquerTileBonus;
        // killing/destroying enemy unit
        if (enemyUnit != null && oldOwner > 0) {
            if (kill) {
                this.killUnit(x, y, oldOwner);
            } else {
                this.convertUnit(enemyUnit, oldOwner, newOwner);
            }
        }
        for (let n of getNeighbourTiles(this.level, x, y)) {
            var owner = this.level.tileMap[n.x][n.y];
            if (owner == 0 || owner == newOwner) {
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
            // a territory without a town, all units die
            for (let r of reachables) {
                this.level.tileMap[r.x][r.y] = 0;
                var unitToDie = this.level.unitMap[r.x][r.y];
                if (unitToDie != Units.Tree) {
                    this.playerStates[owner].tiles--;
                }
                if (unitToDie != null && unitToDie != Units.Tree) {
                    this.killUnit(r.x, r.y, owner);
                }
            }
        }
    }

    convertUnit(unit, oldOwner, newOwner) {
        this.playerStates[newOwner].unitCount[unit]++;
        this.playerStates[oldOwner].unitCount[unit]--;
        if (canMove(unit)) {
            this.playerStates[newOwner].unitMoves++;
            this.playerStates[oldOwner].unitMoves--;
        }
    }

    killUnit(x, y, owner) {
        var unit = this.level.unitMap[x][y];
        this.level.unitMap[x][y] = null;
        this.playerStates[owner].unitCount[unit]--;
        if (canMove(unit)) {
            this.playerStates[owner].unitMoves--;
        }
        animation.addAnimation(new Animation(AnimationType.FadeOut,
            { "x": x, "y": y }, { "x": x, "y": y }, unit, null));

    }

    canMoveForFree(x, y) {
        return !this.movedUnits.has(x + ":" + y);
    }

    checkForSurroundedTiles(player, x, y) {
        for (let n of getNeighbourTiles(this.level, x, y)) {
            var owner = this.level.tileMap[n.x][n.y];
            if (owner == player) {
                continue;
            }
            if (this.isSurrounded(player, n.x, n.y)) {
                //TODO check the defense number of the location
                this.takeTerritory(n.x, n.y, owner, player, false);
            }
        }
    }

    isSurrounded(player, x, y) {
        var surrounds = 0;
        var land = 0;
        for (let n of getNeighbourTiles(this.level, x, y)) {
            var owner = this.level.tileMap[n.x][n.y];
            if (owner != null) {
                land++;
            }
            if (owner == player) {
                surrounds++;
            }
        }
        return surrounds > land / 2;
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
            if (canMove(unit)) {
                state.unitMoves++;
            }
        } else {
            console.error("Invalid build");
        }
    }

    endTurn(player) {
        this.movedUnits.clear();
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
            this.currentPlayer = 1;
        }
        if (this.playerStates[this.currentPlayer].unitCount[Units.Town] == 0) {
            return this.endTurn(this.currentPlayer);
        }
        //this.growTrees();
        return this.currentPlayer;
    }

    killAllUnits(player) {
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == player && canMove(units[x][y])) {
                    this.killUnit(x, y, player);
                }
            }
        }
        this.playerStates[player].money = 0;
    }

    growTrees() {
        //TODO temporarily deactivated because of problems in multi-player
        return;
        var tiles = this.level.tileMap;
        var units = this.level.unitMap;
        var treesToAdd = new Set();
        for (var x = 0; x < this.level.level_width; x++) {
            for (var y = 0; y < this.level.level_heigth; y++) {
                if (tiles[x][y] == null) {
                    continue;
                }
                var rnd = (Math.abs(this.nextRnd()) % 1000) / 1000.0;
                // possibly spawn a tree from a tree
                if (units[x][y] == Units.Tree && rnd <= GamePlayConstants.treeReproduceProbability) {
                    for (let neigh of getNeighbouringHexas(x, y)) {
                        var nx = neigh.x;
                        var ny = neigh.y;
                        if (!this.level.outOfBounds(nx, ny)
                            && tiles[nx][ny] != null
                            && units[nx][ny] == null) {
                            if (!treesToAdd.has(nx + ":" + ny)) {
                                treesToAdd.add(nx + ":" + my);
                                this.addTree(nx, ny);
                                break;
                            }
                        }
                    }
                }
                // possibly spawn a tree from nothing
                if (units[x][y] == null && rnd <= GamePlayConstants.treeSpawnProbability
                    && !treesToAdd.has(x + ":" + y)) {
                    this.addTree(x, y);
                }
            }
        }
    }

    addTree(x, y) {
        var tiles = this.level.tileMap;
        var to = { "x": x, "y": y };
        animation.addAnimation(new Animation(AnimationType.FadeIn,
            to, to, Units.Tree, Units.Tree));

        if (tiles[x][y] > 0) {
            this.playerStates[tiles[x][y]].tiles--;
        }
    }
}
