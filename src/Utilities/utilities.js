function combineObjects(...objects) {
    let combined = {};

    // Helper function to append values from the source object to the combined object
    function appendValues(source) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (combined.hasOwnProperty(key)) {
                    // Concatenate arrays if the key already exists
                    combined[key] = combined[key].concat(source[key]);
                } else {
                    // Directly assign the array if the key is unique
                    combined[key] = source[key];
                }
            }
        }
    }

    // Iterate over each object and append its values
    objects.forEach(appendValues);

    return combined;
}

function allocateExercises(decks, remainingExercises, deckLimits) {
    let allocation = {};

    for (let i = 0; i < decks.length - 1; i++) {
        let maxPossible = remainingExercises - (decks.length - i - 1);
        let deckLimit = deckLimits[decks[i]] !== undefined ? deckLimits[decks[i]] : maxPossible;
        let allocationForDeck = Math.floor(Math.random() * (Math.min(maxPossible, deckLimit) + 1));

        allocation[decks[i]] = allocationForDeck;
        remainingExercises -= allocationForDeck;
    }

    // Ensure the last deck's allocation does not exceed its limit or the remaining exercises
    let lastDeckLimit = deckLimits[decks[decks.length - 1]] !== undefined ? deckLimits[decks[decks.length - 1]] : remainingExercises;
    allocation[decks[decks.length - 1]] = Math.min(remainingExercises, lastDeckLimit);

    return allocation;
}

module.exports = {
    combineObjects : combineObjects,
}