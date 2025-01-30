const DiceValidator = require('./validation');
const RandomGenerator = require('./randomGenerator');
const ProbabilityTable = require('./probabilityTable');
const readline = require('readline-sync');

class Game {
    constructor(dice) {
        this.dice = dice.map(die => die.split(',').map(Number)); // Преобразуем массив строк в массив чисел
        this.availableDice = [...this.dice];
        this.probabilityTable = new ProbabilityTable(this.dice);
    }

    chooseDice(player) {
        if (this.availableDice.length === 0) {
            console.log('No dice left to choose!');
            return null;
        }

        if (player === 'computer') {
            const randomGenerator = new RandomGenerator();
            const index = randomGenerator.generateRandom(0, this.availableDice.length - 1);
            return this.availableDice.splice(index, 1)[0];
        }

        console.log('Choose your dice:');
        this.availableDice.forEach((die, index) => console.log(`${index} - [${die.join(', ')}]`));
        return this.getUserInput('Your selection: ', this.availableDice.length);
    }

    getUserInput(prompt, maxIndex) {
        while (true) {
            const choice = readline.question(prompt);
            const index = parseInt(choice);
            if (!isNaN(index) && index >= 0 && index < maxIndex) {
                return this.availableDice.splice(index, 1)[0];
            }
            console.log('Invalid choice. Please choose a valid index.');
        }
    }

    getNumberInput(prompt, maxNumber) {
        while (true) {
            const input = readline.question(prompt).toUpperCase();
            if (input === 'X') {
                console.log('Goodbye!');
                process.exit(0);
            } else if (input === '?') {
                console.log("Displaying the probability table...");
                this.probabilityTable.printTable();
                continue; 
            }
            const number = parseInt(input);
            if (!isNaN(number) && number >= 0 && number < maxNumber) {
                return number;
            }
            console.log(`Invalid input. Please enter a number between 0 and ${maxNumber - 1}.`);
        }
    }

    playThrow(dice, description) {
        const randomGenerator = new RandomGenerator();
        console.log(description);
        const number = randomGenerator.generateRandom(0, 5);
        const key = randomGenerator.generateKey();
        const hmac = randomGenerator.calculateHMAC(key, number.toString());
        console.log(`I selected a random value in the range 0..${dice.length} (HMAC=${hmac}).`);
        const userNumber = this.getNumberInput(`Add your number modulo ${dice.length}.\n0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help\nYour selection: `, dice.length);
        const resultIndex = (number + userNumber) % dice.length;
        console.log(`My number is ${number} (KEY=${key}).`);
        console.log(`The result is ${number} + ${userNumber} = ${resultIndex} (mod ${dice.length}).`);
        return dice[resultIndex];
    }

    playRound(playerDice, computerDice) {
        const computerThrow = this.playThrow(playerDice, "It's time for my throw.");
        console.log(`My throw is ${computerThrow}.`);
        const userThrow = this.playThrow(computerDice, "It's time for my throw.");
        console.log(`Your throw is ${userThrow}.`);

        if (userThrow > computerThrow) {
            console.log(`You win this round!(${userThrow} > ${computerThrow})`);
        } else if (userThrow < computerThrow) {
            console.log(`I win this round!(${userThrow} < ${computerThrow})`);
        } else {
            console.log(`This round is a tie!(${userThrow} == ${computerThrow})`);
        }
    }

    run() {
        const validator = new DiceValidator(this.dice);
        if (!validator.validate()) return;

        console.log("Let's determine who makes the first move.");
        const randomGenerator = new RandomGenerator();
        const key = randomGenerator.generateKey();
        const randomValue = randomGenerator.generateRandom(0, 1);
        const hmac = randomGenerator.calculateHMAC(key, randomValue.toString());
        console.log(`I selected a random value in the range 0..1 (HMAC=${hmac}).`);
        console.log('Try to guess my selection.\n0 - 0\n1 - 1\nX - exit\n? - help');

        const userGuess = this.getNumberInput('Your selection: ', 2);
        console.log(`My selection: ${randomValue} (KEY=${key}).`);
        let playerDice, computerDice;

        if (userGuess === randomValue) {
            console.log('You make the first move and choose your dice.');
            playerDice = this.chooseDice('user');
            computerDice = this.chooseDice('computer');
        } else {
            computerDice = this.chooseDice('computer');
            console.log(`I make the first move and choose the dice: [${computerDice.join(', ')}].`);
            playerDice = this.chooseDice('user');
        }

        console.log(`You chose the dice: [${playerDice.join(', ')}].`);
        console.log(`I chose the dice: [${computerDice.join(', ')}].`);
        this.playRound(playerDice, computerDice);
    }
}

const game = new Game(process.argv.slice(2));
game.run();