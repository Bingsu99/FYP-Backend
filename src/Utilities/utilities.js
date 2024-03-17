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

module.exports = {
    combineObjects : combineObjects,
}