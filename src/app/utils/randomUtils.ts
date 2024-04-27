export const getRandomSign = () => {
    return Math.random() >= 0.5 ? 1 : -1;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomNumbersInInterval = ({
    interval: [min, max],
    amount,
                                      }: {
    interval: [min: number, max: number],
    amount: number,
}): Array<number> => {
    const result = [];
    const equalSubIntervalLength = (max - min) / amount;

    let currentSign = getRandomSign();
    let currentDelta = getRandomInt(0, equalSubIntervalLength / 2);

    for (let i = 0; i < amount; i++) {
        // i = 0
        if (!result.length) {
            result.push(min);
            continue;
        }
        if (i === amount - 1) {
            result.push(max);
            continue;
        }

        // i = 1,2,3...
        if (i % 2 === 0) {
            currentSign = currentSign *= -1;
        }

        const newNumber = i * equalSubIntervalLength + currentSign * currentDelta;
        result.push(newNumber);

        if (i % 2 === 0) {
            currentSign = getRandomSign();
            currentDelta = getRandomInt(0, equalSubIntervalLength / 2);
        }
    }

    return result;
}
