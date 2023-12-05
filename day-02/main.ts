import { readFileSync } from "node:fs";

const sampleInput01 = [
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];


type ColorScore = {
    red: number;
    green: number;
    blue: number;
};

const maxCubes: ColorScore = {
    red: 12,
    green: 13,
    blue: 14,
} as const;

type ColorKey = keyof ColorScore;

function part1_and_2(input: string[]): [number, number] {
    let total = 0;
    let totalPower = 0;

    for (const li of input) {
        const [game, gameData] = li.split(": ");
        const gameId = parseInt(game.split(" ")[1]);
        const gameSets = gameData.split("; ");

        const gameTopVals: ColorScore = {
            red: 0,
            green: 0,
            blue: 0,
        };

        for (const game of gameSets) {
            for (const pairRaw of game.split(",")) {
                const [numStr, colorPart] = pairRaw.trim().split(" ");
                const color = colorPart as ColorKey;
                const val = parseInt(numStr);
                gameTopVals[color] = Math.max(gameTopVals[color], val);
            }
        }

        let valid = true;
        if (gameTopVals.red > maxCubes.red
            || gameTopVals.green > maxCubes.green
            || gameTopVals.blue > maxCubes.blue) {
            valid = false;
        }

        const power = gameTopVals.red * gameTopVals.green * gameTopVals.blue;
        totalPower += power;
        if (valid) {
            total += gameId;
        }
    }

    return [total, totalPower];
}

const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
const [part1, part2] = part1_and_2(input);
console.log("🦊>>>> part1", part1)
console.log("🦊>>>> part2", part2)
