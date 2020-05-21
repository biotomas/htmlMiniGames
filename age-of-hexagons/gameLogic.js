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

var UnitNames = ["Tree", "Tower", "Village", "Farm", "Peasant", "Spearman", "Swordsman",
"Knight"];
var UnitDescriptions = [
    "Gives 3 gold when cut, can spread after each round", 
    "defends surrounding tiles against peasants and spearmen",
    "supplies you units, allows to build new ones",
    "produces regular income, defends itself against peasants",
    "can cut trees, kill peasants and conquer tiles",
    "can destroy farms and kill spearmen and peasants",
    "can destroy and kill all but villages and knights",
    "can destroy every unit and structure in the game"
];

var GamePlayConstants = {
    // The ordering in the arrays below corresponds to Units above
    defense: [0, 3, 4, 2, 1, 2, 3, 4],
    attack: [0, 0, 0, 0, 1, 2, 3, 4],
    range: [0, 0, 0, 0, 3, 2, 1, 3],
    incomes: [0, -5, 5, 5, -5, -10, -20, -30],
    cost: [0, 10, 30, 10, 10, 20, 30, 40],
    tileIncome: 1,
    conquerTileBonus: 2,
    cutTreeBonus: 3,
    movesPerTurn: 3,
    startMoney: 10,
    treeSpawnProbability: 0.01,
    treeReproduceProbability: 0.2,
}

States = {
    IDLE: 0,
    MOVE: 1,
    BUILD: 2,
    MENU: 3,
    ANIMATION: 4,
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

function canBuildHere(level, mx, my, currentPlayer) {
    return (level.tileMap[mx][my] == currentPlayer) && level.unitMap[mx][my] == null;
}

function mergeUnits(unit1, unit2) {
    var min = Math.min(unit1, unit2);
    var max = Math.max(unit1, unit2);
    if (min == Units.Peasant) {
        return Math.min(max + 1, Units.Knight);
    } else {
        return Units.Knight;
    }
}

function canMove(unit) {
    return unit > 3 && unit < 8;
}

function getNeighbouringHexas(x, y) {
    result = new Array();
    list = x % 2 == 0 ? hexagonNeighbourhoodEven : hexagonNeighbourhoodOdd;
    for (let coord of list) {
        result.push({ "x": x + coord.x, "y": y + coord.y });
    }
    return result;
}

function getNeighbourTiles(level, x, y) {
    var result = new Set();
    for (let n of getNeighbouringHexas(x, y)) {
        if (canReach(level, n.x, n.y)) {
            result.add(n);
        }
    }
    return result;
}

function allRaeachableWithinNation(level, x, y) {
    var result = new Set();
    var nation = level.tileMap[x][y];
    for (let r of getReachableNodes(level, x, y, null)) {
        if (level.tileMap[r.x][r.y] == nation) {
            result.add(r);
        }
    }
    return result;
}

function getReachableTiles(gameMaster, x, y) {
    var player = gameMaster.currentPlayer;
    var unit = gameMaster.level.unitMap[x][y];
    var reachable = new Set();
    for (let node of getReachableNodes(gameMaster.level, x, y, GamePlayConstants.range[unit])) {
        if (gameMaster.canEnterWithUnit(player, unit, node.x, node.y)) {
            reachable.add(node);
        }
    }
    return reachable;
}

function contains(coords, x, y) {
    for (let coord of coords) {
        if (coord.x == x && coord.y == y)
            return true;
    }
    return false;
}

function getReachableNodes(level, x, y, distance) {
    var visited = new Set();
    var reachable = new Set();
    var nation = level.tileMap[x][y];
    var queue = [];
    queue.push({ "x": x, "y": y, "d": 0 });
    while (queue.length > 0) {
        var node = queue.shift();
        if (visited.has(node.x + ":" + node.y)) {
            continue;
        }
        visited.add(node.x + ":" + node.y);
        if (canReach(level, node.x, node.y)) {
            reachable.add({ "x": node.x, "y": node.y });
            if ((distance == null || node.d < distance)
                && level.tileMap[node.x][node.y] == nation) {
                for (let neigh of getNeighbouringHexas(node.x, node.y)) {
                    queue.push({ "x": neigh.x, "y": neigh.y, "d": node.d + 1 });
                }
            }
        }
    }
    return reachable;
}

function canReach(level, x, y) {
    return !level.outOfBounds(x, y) && level.tileMap[x][y] != null;
}

class PlayerState {

    constructor() {
        this.money = GamePlayConstants.startMoney;
        this.moves = GamePlayConstants.movesPerTurn;
        this.tiles = 0;
        this.unitCount = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    endTurn() {
        this.money += this.getIncome();
        this.moves = GamePlayConstants.movesPerTurn;
    }

    getIncome() {
        var total = this.tiles * GamePlayConstants.tileIncome;
        for (var i = 1; i < 8; i++) {
            total += this.unitCount[i] * GamePlayConstants.incomes[i];
        }
        return total;
    }
}

