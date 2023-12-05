import { readFileSync } from "node:fs";

const sampleInput01 = [
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
];

const sampleInput02 = [
    "........*..511.",
    "..........-....",
    ".10............",
    "...*......222..",
    "....291........",
    ".............33",
];

function get(matrix: string[], x: number, y: number) : string | null{
    if (y < 0 || y >= matrix.length) {
        return null;
    }

    const row = matrix[y];
    if (x < 0 || x >= row.length) {
        return null;
    }

    return row[x];
}

function checkSymbols(matrix: string[], x: number, y: number) : [boolean, string] {
    for (let i = y - 1; i <= y + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
            const ch = get(matrix, j, i);
            if (ch === null) continue;

            const isNumber = parseInt(ch) >= 0;
            if (!isNumber && ch !== ".") {
                const symbolId = `${ch}-${i}-${j}`;
                return [true, symbolId];
            }
        }
    }

    return [false, ""];
}

function part01_and_02(matrix: string[]) {
    const partNumbers = [];
    const gearInfo : { [key: string]: number[] } = {};

    for (let y = 0; y < matrix.length; y++) {
        let strNumber = "";
        let currSymbolId = "";
        let symbolFound = false;

        for (let x = 0; x < matrix[y].length; x++) {
            const ch = matrix[y][x];

            if (ch.match(/\d/)) {
                strNumber += ch;

                // check neighbor cells for an asterisk
                const [ok, symbolId] = checkSymbols(matrix, x, y);
                if (ok) {
                    if (symbolId[0] === "*" && !Object.hasOwn(gearInfo, symbolId)) {
                        gearInfo[symbolId] = [];
                    }

                    currSymbolId = symbolId;
                    symbolFound = true;
                }
            } else if (strNumber) {
                if (symbolFound) {
                    const num = parseInt(strNumber);
                    currSymbolId[0] === "*" && gearInfo?.[currSymbolId]?.push(num)
                    partNumbers.push(num);
                }

                symbolFound = false;
                strNumber = "";
            }
        }

        if (strNumber && symbolFound) {
            const num = parseInt(strNumber);
            partNumbers.push(num);
            currSymbolId[0] === "*" && gearInfo?.[currSymbolId]?.push(num)
        }
    }

    const totalGearRatios = Object.values(gearInfo).reduce((c, x) => {
        if (x.length !== 2) return c;

        return c + (x[0] * x[1]);
    }, 0);

    // for (const [k, v] of Object.entries(gearInfo)) {
    //     console.log(k, v.toString());
    // }

    const total = partNumbers.reduce((c, x) => (c + x), 0);
    return [total, totalGearRatios];
}

const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
const [p1, p2] = part01_and_02(input);

console.log("part1=", p1);
console.log("part2=", p2);
