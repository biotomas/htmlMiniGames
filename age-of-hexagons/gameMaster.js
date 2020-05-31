class GameMaster {

    constructor(level, players) {
        this.level = level;
        this.players = players;
        this.currentPlayer = 1;
        this.playerStates = new Array(players + 1);
        this.rndState = 42; // random seed
        for (var pi = 0; pi <= 8; pi++) {
            this.playerStates[pi] = new PlayerState();
            this.playerStates[pi].tiles = this.countTiles(pi) - this.countUnits(pi, Units.Tree);
            for (var unit = 1; unit < 8; unit++) {
                this.playerStates[pi].unitCount[unit] = this.countUnits(pi, unit);
            }
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

        // cutting a tree
        if (goalUnit == Units.Tree) {
            state.money += GamePlayConstants.cutTreeBonus;
            state.tiles++;
            this.level.unitMap[tox][toy] = null;
            animation.addAnimation(new Animation(AnimationType.FadeOut,
                to, to, Units.Tree, thisUnit, 1000));

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
                this.level.unitMap[tox][toy] = null;
                animation.addAnimation(new Animation(AnimationType.FadeOut,
                    to, to, goalUnit, null, 1000));
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
                // a territory without a town, all units die
                for (let r of reachables) {
                    this.level.tileMap[r.x][r.y] = 0;
                    var unitToDie = this.level.unitMap[r.x][r.y];
                    if (unitToDie != Units.Tree) {
                        this.playerStates[goalPlayer].tiles--;
                    }

                    if (unitToDie != null && unitToDie != Units.Tree) {
                        this.level.unitMap[r.x][r.y] = null;
                        this.playerStates[goalPlayer].unitCount[unitToDie]--;
                        animation.addAnimation(new Animation(AnimationType.FadeOut,
                            { "x": r.x, "y": r.y }, { "x": r.x, "y": r.y }, unitToDie, null, 1000));
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
            animation.addAnimation(new Animation(AnimationType.Move,
                { "x": fromx, "y": fromy }, { "x": tox, "y": toy }, thisUnit, mergedUnit, 1000));
        } else {
            // moving unit
            animation.addAnimation(new Animation(AnimationType.Move,
                { "x": fromx, "y": fromy }, { "x": tox, "y": toy }, thisUnit, thisUnit, 1000));
        }
        this.level.tileMap[tox][toy] = player;
        this.level.unitMap[fromx][fromy] = null;
        state.moves--;
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
                    animation.addAnimation(new Animation(AnimationType.FadeOut,
                        { "x": x, "y": y }, { "x": x, "y": y }, units[x][y], null, 1000));
                    units[x][y] = null;
                }
            }
        }
        this.playerStates[player].unitCount[Units.Peasant] = 0;
        this.playerStates[player].unitCount[Units.Swordsman] = 0;
        this.playerStates[player].unitCount[Units.Spearman] = 0;
        this.playerStates[player].unitCount[Units.Knight] = 0;
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
            to, to, Units.Tree, Units.Tree, 1000));

        if (tiles[x][y] > 0) {
            this.playerStates[tiles[x][y]].tiles--;
        }
    }
}
