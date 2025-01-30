class DiceValidator {
    constructor(dice) {
        this.dice = dice;
    }

    validate() {

        if (!Array.isArray(this.dice) || this.dice.length < 3) {
            console.log('You must provide at least 3 dice configurations.');
            return false;
        }

        let isOk = true;

        const firstDiceLength = this.dice[0].length; 
        this.dice.forEach((values, index) => {

            if (values.length < 4 || values.some(value => isNaN(value))) {
                console.log(`Dice configuration at index ${index} is invalid. Each dice must have minimum 4 numeric values.`);
                isOk = false;
                return;
            }

            if (values.length !== firstDiceLength) {
                console.log(`Dice configuration at index ${index} has a different length. All configurations must have the same number of values.`);
                isOk = false;
                return;
            }

            if (values.length % 2 !== 0) {
                console.log(`Dice configuration at index ${index} has an odd number of values. The length must be even.`);
                isOk = false;
                return;
            }
        });
        return isOk; 
    }
}

module.exports = DiceValidator;
