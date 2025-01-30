const Table = require('cli-table3');
const ProbabilityCalculator = require('./probabilityCalculator')

class ProbabilityTable {
    constructor(dice) {
        this.dice = dice;
        this.calculator = new ProbabilityCalculator();
    }

    printTable() {
        const table = new Table({
            head: [''].concat(this.dice.map(die => `[${die.join(',')}]`)),
            colWidths: new Array(this.dice.length + 1).fill(15),
        });

        for (let i = 0; i < this.dice.length; i++) {
            let row = [`[${this.dice[i].join(',')}]`];
            for (let j = 0; j < this.dice.length; j++) {
                row.push(i === j ? '--' : this.calculator.calculateWinProbability(this.dice[i], this.dice[j]));
            }
            table.push(row);
        }

        console.log(table.toString());
    }
}


module.exports = ProbabilityTable;
