var Units = {
    Tree: 0,
    Tower: 1,
    Town: 2,
    Farm: 3,
    Peasant: 4,
    Spearman: 5,
    Swordsman: 6,
    Knight: 7
}

var hexagonNeighbourhoodEven = new Set([
    { "x": -1, "y": -1 },
    { "x": -1, "y": 0 },
    { "x": 0, "y": -1 },
    { "x": 0, "y": +1 },
    { "x": 1, "y": -1 },
    { "x": 1, "y": 0 },
]);

var hexagonNeighbourhoodOdd = new Set([
    { "x": -1, "y": 0 },
    { "x": -1, "y": 1 },
    { "x": 0, "y": -1 },
    { "x": 0, "y": +1 },
    { "x": 1, "y": 0 },
    { "x": 1, "y": 1 },
]);

function canBuildHere(level, mx,my, currentPlayer) {
    return (level.tileMap[mx][my] == currentPlayer) && level.unitMap[mx][my] == null;
}

function getNeighbouringHexas(x, y) {
    result = new Array();
    list = x % 2 == 0 ? hexagonNeighbourhoodEven : hexagonNeighbourhoodOdd;
    for (let coord of list) {
        result.push({ "x": x + coord.x, "y": y + coord.y });
    }
    return result;
}

function getReachableTiles(level, x, y) {
    unit = level.unitMap[x][y];
    nation = level.tileMap[x][y];
    rechable = new Set();
    visited = new Set();
    visitAllNeighboursIfPossible(level, x, y, unit, nation, rechable, visited, 3);
    return rechable;
}

function contains(coords, x, y) {
    for (let coord of coords) {
        if (coord.x == x && coord.y == y)
            return true;
    }
    return false;
}

function visitAllNeighboursIfPossible(level, x, y, unit, nation, reachable, visited, distance) {
    if (distance <= 0) {
        return;
    }

    for (let coordDelta of getNeighbouringHexas(x, y)) {
        dx = coordDelta.x;
        dy = coordDelta.y;
        if (canReach(level, dx, dy, unit, nation)) {
            reachable.add({ "x": dx, "y": dy });
            if (canContinue(level, dx, dy, unit, nation))
                visitAllNeighboursIfPossible(level, dx, dy, unit, nation, reachable, visited, distance - 1)
        }
    }

}

function canReach(level, x, y, unit, nation) {
    //This will be much more complicated later
    return !level.outOfBounds(x, y) && unit > 3 && unit < 8 && level.tileMap[x][y] != null && level.unitMap[x][y] == null;
}

function canContinue(level, x, y, unit, nation) {
    //This will be much more complicated later
    return !level.outOfBounds(x, y) && unit > 3 && unit < 8 && level.tileMap[x][y] == nation;
}

var GamePlayConstants = {
    // per turn incomes
    farmIncome: 5,
    townIncome: 10,
    tileIncone: 1,
    // one time incomes
    conquerTileBonus: 3,
    cutTreeBonus: 3,
    // per turn costs
    peasantSalary: 5,
    spearmanSalary: 10,
    swordsmanSalary: 20,
    knightSalary: 40,
    // one time costs
    peasantCost: 10,
    spearmanCost: 20,
    swordsmanCost: 25,
    knightCost: 50
}

class GameState {

    constructor() {
        this.currentPlayer = 1;
    }

}

class PlayerState {

    constructor() {
        this.money = 10;
        this.farms = 0;
        this.tiles = 0;
        this.towns = 1;
        this.peasants = 0;
        this.spearmen = 0;
        this.swordsmen = 0;
        this.knights = 0;
    }

    endTurn() {
        this.money += this.getIncome();
    }

    getExpenses() {
        return GamePlayConstants.peasantSalary * this.peasants + GamePlayConstants.spearmanSalary * this.spearmen
            + GamePlayConstants.swordsmanSalary * this.swordsmen + GamePlayConstants.knightSalary * this.knights;
    }

    getEarnings() {
        return GamePlayConstants.farmIncome * this.farms + GamePlayConstants.townIncome * this.towns + GamePlayConstants.tileIncone * this.tiles;
    }

    getIncome() {
        return getEarnings() - getExpenses();
    }
}

