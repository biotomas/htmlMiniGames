var units = {
    Tree:0,
    Tower:1,
    Town:2,
    Farm:3,
    Peasant:4,
    Spearman:5,
    Swordsman:6,
    Knight:7
}

var GamePlayConstants = {
    // per turn incomes
    farmIncome:5,
    townIncome:10,
    tileIncone:1,
    // one time incomes
    conquerTileBonus:3,
    cutTreeBonus:3,
    // per turn costs
    peasantSalary:5,
    spearmanSalary:10,
    swordsmanSalary:20,
    knightSalary:40,
    // one time costs
    peasantCost:10,
    spearmanCost:20,
    swordsmanCost:25,
    knightCost:50
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

    getExpenses() {
        return GamePlayConstants.peasantSalary*this.peasants + GamePlayConstants.spearmanSalary * this.spearmen 
        + GamePlayConstants.swordsmanSalary*this.swordsmen + GamePlayConstants.knightSalary*this.knights;
    }


    getEarnings() {
        return GamePlayConstants.farmIncome*this.farms + GamePlayConstants.townIncome*this.towns + GamePlayConstants.tileIncone*this.tiles;
    }

    getIncome() {
        return getEarnings() - getExpenses();
    }
}

