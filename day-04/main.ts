import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
];

export function part01_and_02(lines: string[]) {
    let totalScore = 0;

    const copies = lines.map(() => 1);
    for (const [i, li] of lines.entries()) {
        const [cardRaw, winningRaw, attemptRaw] = li.split(/:|\|/);
        const winningNumbers = new Set(winningRaw.trim().split(/\s+/).map(Number));
        const myNumbers = attemptRaw.trim().split(/\s+/).map(Number);

        let matches = 0;
        for (const x of myNumbers) {
            if (winningNumbers.has(x)) {
                matches += 1;
            }
        }

        const times = copies[i];
        for (let cnt = 0; cnt < times; cnt++) {
            for (let j = i + 1; j <= i + matches; j++) {
                copies[j] += 1;
            }
        }

        const score = matches > 0 ? 2 ** (matches - 1) : 0;
        totalScore += score;
    }

    // sum the values contained in copies
    const totalCopies = copies.reduce((a, b) => a + b, 0);

    return [totalScore, totalCopies];
}

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
    const [p1, p2] = part01_and_02(input);

    console.log("part1=", p1);
    console.log("part2=", p2);
}