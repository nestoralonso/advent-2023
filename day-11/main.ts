import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "...#......",
    ".......#..",
    "#.........",
    "..........",
    "......#...",
    ".#........",
    ".........#",
    "..........",
    ".......#..",
    "#...#.....",
];

const EXPAND_AMOUNT = 1000000 - 1;
type Pos = [number, number];

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
    console.log("🦊>>>> ~ input:", input.length, input[0].length)

    const p1 = part1(input);
    console.log("🦊>>>> part1", p1)

    const p2 = part2(input);
    console.log("🦊>>>> part2", p2)
}

function part1(input: string[]): number {
    const matrix = parseLines(input);
    printMap(matrix);

    const expanded = expandMap(matrix);
    printMap(expanded);

    const galaxies = findGalaxies(expanded);
    const galaxyPairs = findGalaxyPairs(galaxies);
    let sum = 0;
    for (const [galaxy1, galaxy2] of galaxyPairs) {
        //@ts-ignore
        sum += dist(galaxies.get(galaxy1), galaxies.get(galaxy2));
    }

    return sum;
}

function part2(input: string[]): number {
    const matrix = parseLines(input);
    printMap(matrix);

    const galaxiesSlim = findGalaxies(matrix);
    const galaxyPairs = findGalaxyPairs(galaxiesSlim);
    const [rowsToExpand, colsToExpand] = getRowsColsToExpand(matrix);

    let sum2 = 0;
    for (const [g1Key, g2Key] of galaxyPairs) {
        const gs1 = galaxiesSlim.get(g1Key) as Pos;
        const gs2 = galaxiesSlim.get(g2Key) as Pos;
        const d2 = distStrange(gs1, gs2, rowsToExpand, colsToExpand);

        sum2 += d2;
    }

    return sum2;
}

export function parseLines(input: string[]): string[][] {
    return input.map(line => line.split(""));
}

function printMap(map: string[][]) {
    for (const row of map) {
        const galaxies = row.filter(c => c === "#");
        const strRow = row.map(c => c === "#" ? `%c#%c` : c).join("");
        console.log(strRow, ...galaxies.flatMap(_c => [`color: red`, `color: white`]));
    }
}

export function expandMap(map: string[][]): string[][] {

    const expanded = structuredClone(map);
    const colsToExpand: number[] = [];
    for (let x = 0; x < map[0].length; x++) {
        // count number of # in this column
        const count = map.reduce((acc, row) => {
            if (row[x] === "#") return acc + 1;
            return acc;
        }, 0);

        if (count === 0) {
            colsToExpand.push(x);
        }
    }

    for (let i = 0; i < expanded.length; i++) {
        const newRow = expanded[i].flatMap((v, i) => {
            if (colsToExpand.includes(i)) {
                return [".", "."];
            }
            return [v];
        });

        expanded[i] = newRow;
    }

    // expand rows
    const rowsToExpand: number[] = [];
    for (let i = 0; i < map.length; i++) {
        // count number of # in this row
        const count = map[i].reduce((acc, c) => {
            if (c === "#") return acc + 1;
            return acc;
        }, 0);

        if (count === 0) {
            rowsToExpand.push(i);
        }
    }
    console.log("🦊>>>> ~ expandMap ~ rowsToExpand:", rowsToExpand)

    const newRows = [];
    for (let i = 0; i < expanded.length; i++) {
        if (rowsToExpand.includes(i)) {
            newRows.push(expanded[i]);
        }

        newRows.push(expanded[i]);
    }

    return newRows;
}

export function findGalaxies(matrix: string[][]) {
    const res = new Map<string, Pos>();

    let num = 1;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const c = matrix[i][j];
            if (c === "#") {
                const key = `${num}`;
                res.set(key, [i, j]);
                num++;
            }
        }
    }

    return res;
}

export function getRowsColsToExpand(matrix: string[][]): [number[], number[]] {
    const colsToExpand: number[] = [];

    for (let x = 0; x < matrix[0].length; x++) {
        // count number of # in this column
        const count = matrix.reduce((acc, row) => {
            if (row[x] === "#") return acc + 1;
            return acc;
        }, 0);

        if (count === 0) {
            colsToExpand.push(x);
        }
    }

    // expand rows
    const rowsToExpand: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
        // count number of # in this row
        const count = matrix[i].reduce((acc, c) => {
            if (c === "#") return acc + 1;
            return acc;
        }, 0);

        if (count === 0) {
            rowsToExpand.push(i);
        }
    };

    return [rowsToExpand, colsToExpand];
}

export function findGalaxyPairs(galaxyMap: Map<string, Pos>): Array<[string, string]> {
    const pairs: Array<[string, string]> = [];
    const charArray = [...galaxyMap.keys()];
    for (let i = 0; i < charArray.length; i++) {
        for (let j = i + 1; j < charArray.length; j++) {
            pairs.push([charArray[i], charArray[j]]);
        }
    }

    return pairs;
}

export function dist(pos1: Pos, pos2: Pos): number {
    // compute manhattan distance
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

function diffPos(pos1: Pos, pos2: Pos): Pos {
    return [pos1[0] - pos2[0], pos1[1] - pos2[1]];
}


function distStrange(pos1: Pos, pos2: Pos, rowsToExpand: number[], colsToExpand: number[]): number {
    // compute manhattan distance
    let [i, j] = pos1;
    const [targetI, targetJ] = pos2;

    const [diffI, diffJ] = diffPos(pos2, pos1);
    const deltaI = diffI > 0 ? 1 : -1;
    const deltaJ = diffJ > 0 ? 1 : -1;

    let dist = 0;
    while (j !== targetJ) {
        j += deltaJ;

        dist += 1;

        if (colsToExpand.includes(j)) {
            dist += EXPAND_AMOUNT;
        }

        if (j === targetJ) {
            break;
        }
    }

    while (i !== targetI) {
        i += deltaI;

        dist += 1;

        if (rowsToExpand.includes(i)) {
            dist += EXPAND_AMOUNT;
        }

        if (i === targetI) {
            break;
        }
    }

    return dist;
}