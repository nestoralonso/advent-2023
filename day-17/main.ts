// deno-lint-ignore-file prefer-const
import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";
import { PriorityQueue } from "./PriorityQueue.ts";

export const sampleInput01 = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`;


type Matrix = number[][];

function parseInput(input: string): Matrix {
    return input
        .trim()
        .split("\n")
        .map(li => {
            const row = li.split("");
            return row.map(Number);
        });

}

type QueueElem = [number, number, number, number, number, number];

const Dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];

const compareFunc = (a: QueueElem, b: QueueElem) => a[0] - b[0];
function part1(matrix: Matrix): number {
    const seen = new Set<string>();
    const pq = new PriorityQueue<QueueElem>(compareFunc);
    pq.push([0, 0, 0, 0, 0, 0]);
    const nRows = matrix.length;
    const nCols = matrix[0].length;

    while (pq.size()) {
        const [heatLoss, i, j, di, dj, n] = pq.pop()!;

        if (i === nRows - 1 && j === nCols - 1) {
            return heatLoss;
        }

        if (seen.has(`${i},${j},${di},${dj},${n}`)) {
            continue;
        }

        seen.add(`${i},${j},${di},${dj},${n}`);

        if (n < 3 && (di !== 0 || dj !== 0)) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < nRows && nj >= 0 && nj < nCols) {
                pq.push([heatLoss + matrix[ni][nj], ni, nj, di, dj, n + 1]);
            }
        }

        for (const [ndI, ndJ] of Dirs) {
            if ((ndI !== di || ndJ !== dj) && (ndI !== -di || ndJ !== -dj)) {
                const nr = i + ndI;
                const nc = j + ndJ;
                if (nr >= 0 && nr < nRows && nc >= 0 && nc < nCols) {
                    pq.push([heatLoss + matrix[nr][nc], nr, nc, ndI, ndJ, 1]);
                }
            }
        }
    }

    return -1;
}


export function printMatrix(matrix: Matrix) {
    const nRows = matrix.length;
    const nCols = matrix[0].length;

    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            printf("%d", matrix[i][j]);
        }

        printf("\n");
    }
}

if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const matrix = parseInput(rawInput);
    // printMatrix(matrix);

    const p1 = part1(matrix);
    console.log("🦊>>>> ~ p1:", p1)
}
