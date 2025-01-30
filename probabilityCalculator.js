class ProbabilityCalculator {
    calculateWinProbability(dieA, dieB) {
        let winCount = 0;
        let total = dieA.length * dieB.length;
        for (const valueA of dieA) {
            for (const valueB of dieB) {
                if (valueA > valueB) {
                    winCount++;
                }
            }
        }
        return (winCount / total).toFixed(2);
    }
}

module.exports = ProbabilityCalculator;