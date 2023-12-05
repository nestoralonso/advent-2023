import { readFileSync } from "node:fs";

const sampleInput = [
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet"
];

const sampleInput2 = [
    'two1nine',
    'eightwothree',
    'abcone2threexyz',
    'xtwone3four',
    '4nineeightseven2',
    'zoneight234',
    '7pqrstsixteen',
];

function day1_01(input: string[]) {
    let total = 0;
    for (const li of input) {
        const [first, last] = getDigits(li);
        const num = parseInt(`${first}${last}`);

        total += num;
    }

    return total;
}


function day1_02(input: string[]) {
    let total = 0;
    for (const li of input) {
        const [first, last] = getDigitsPlus(li);
        const num = parseInt(`${first}${last}`);
        if (Number.isNaN(num)) {
            console.error("🦊>>>> ", li, first, last, " is NaN")
            throw new Error("wordToDigit is NaN");
        }

        total += num;
    }

    return total;
}

function getDigits(li: string) {
    let firstNumber = null;
    let currNumber = null;

    for (const [_i, v] of li.split("").entries()) {
        const num = parseInt(v);
        if (firstNumber === null && !Number.isNaN(num)) {
            firstNumber = num;
        }
        if (!Number.isNaN(num)) {
            currNumber = num;
        }
    }

    return [firstNumber, currNumber];
}

const wordsToDigitsMap = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
} as const;

type SpelledDigit = keyof typeof wordsToDigitsMap;
function wordToDigit(word: SpelledDigit): number {
    const res = wordsToDigitsMap[word] ?? NaN;

    if (Number.isNaN(res)) {
        console.error("[ERROR]", word, " is NaN")
        throw new Error("wordToDigit is NaN");
    }

    return res;
}


function getDigitsPlus(li: string) {
    const re = /(one|two|three|four|five|six|seven|eight|nine|\d)/;

    let strFirst = "";
    let strLast = "";

    let firstDigit = NaN;
    let lastDigit = NaN;

    let i = 0;
    while (!firstDigit || !lastDigit) {
        if (!firstDigit) {
            strFirst += li[i];

            const match = strFirst.match(re);
            if (match) {
                const digit = match[0] as SpelledDigit;
                firstDigit = wordToDigit(digit);
            }
        }

        if (!lastDigit) {
            strLast = li[li.length - i - 1] + strLast;
            const match = strLast.match(re);
            if (match) {
                const digit = match[0] as SpelledDigit;
                lastDigit = wordToDigit(digit);
            }
        }

        i += 1;
    }


    return [firstDigit, lastDigit];
}

const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);

let res = day1_01(input);
console.log("🦊>>>> ~ part1:", res)

res = day1_02(input);
console.log("🦊>>>> ~ part2:", res)
