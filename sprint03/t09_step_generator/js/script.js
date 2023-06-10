let previousResult = 1;

function generateNumber() {
    const input = prompt(`Previous result: ${previousResult}. Enter a new number:`);

    if (isNaN(input)) {
        console.error("Invalid number!");
    } else {
        const number = Number(input);
        previousResult += number;

        console.log(`Previous result: ${previousResult}`);

        if (previousResult > 10000) {
            previousResult = 1;
        }

        generateNumber();
    }
}

generateNumber();
