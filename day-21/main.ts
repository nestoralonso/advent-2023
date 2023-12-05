import { green } from "https://deno.land/std@0.209.0/fmt/colors.ts";
import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";


export const sampleInput01 = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;

type Matrix = string[][];

if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const matrix = parseInput(rawInput);
    printMatrix(matrix)
    const p1 = part1(matrix);
    console.log("🦊>>>> ~ p1:", p1)
}

type Task = [
    number, // row
    number, // col
    number, // ramaining steps
];

type Pos = [
    number, // row
    number, // col
];
function part1(m: Matrix): number {

    let startRow = 0;
    let startCol = 0;
    outer: for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (m[i][j] === "S") {
                startRow = i;
                startCol = j;
                m[i][j] = ".";
                break outer;
            }
        }
    }

    const queue: Task[] = [[startRow, startCol, 64]];
    const answer = new Map<string, Pos>();
    const seen = new Set<string>();

    while (queue?.length) {
        const [row, col, steps] = queue.shift()!;

        if (steps % 2 === 0) {
            answer.set(`${row}-${col}`, [row, col]);
        }
        if (steps === 0) continue;

        const nextCells: Pos[] = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
        for (const [i, j] of nextCells) {
            const cellKey = `${i}-${j}`;
            if (i < 0 || i >= m.length || j < 0 || j >= m[0].length || m[i][j] === "#" || seen.has(cellKey)) {
                continue;
            }

            seen.add(cellKey);
            queue.push([i, j, steps - 1]);
        }
    }

    return answer.size;
}

function parseInput(input: string): Matrix {
    return input.trim().split("\n").map(li => li.split(""));
}

export function printMatrix(m: Matrix) {
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            const cell = m[i][j];
            if (cell === ".") {
                printf("%s", green(cell));
            } else {
                printf("%s", cell);
            }
        }
        printf("\n");
    }
}