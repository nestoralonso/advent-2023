import { readFileSync } from "node:fs";
import * as fmt from "https://deno.land/std@0.209.0/fmt/printf.ts";
import * as ansi from 'npm:node-ansi@1.3.0';

// todo: use deno colors
import * as mod from "https://deno.land/std@0.209.0/fmt/colors.ts";

type Pos = [number, number];

const screenOffset = [10, 3];

export const sampleInput01 =
    `
    .....#....
    O.OO#....#
    .....##...
    OO.#O....O
    .O.....O#.
    O.#..O.#.#
    ..O..#O..O
    .......OO.
    #....###..
    .OO..#....
        `.split("\n").map(s => s.trim()).filter(Boolean).join("\n")
    ;

if (import.meta.main) {
    const [input, rocksI] = parseMatrix(readFileSync("./input.txt", { encoding: "utf8" }));
    const p1 = part1(input, rocksI);
    console.log("🦊>>>> ~ p1:", p1);
}

function parseMatrix(raw: string): [string[][], Pos[]] {
    const res = raw.split("\n").filter(Boolean).map(line => line.split(""));

    const rocks: Pos[] = [];
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
            if (res[i][j] === "O") {
                res[i][j] = ".";
                rocks.push([i, j]);
            }
        }
    }

    return [res, rocks];
}

function part1(matrix: string[][], rocks: Pos[]): number {
    gravity(matrix, rocks);
    const load = calcLoad(matrix, rocks);
    printMatrix(matrix, rocks);

    return load;
}

function calcLoad(_matrix: string[][], rocks: Pos[]): number {
    let load = 0;
    for (const rock of rocks) {
        const [i] = rock;
        const yScore = _matrix.length - i;

        load += yScore;
    }

    return load;
}

export function gravity(matrix: string[][], rocks: Pos[]) {
    let changed = true;
    const rockMap = new Map<number, Pos[]>();
    for (const rock of rocks) {
        const [, j] = rock;
        if (!rockMap.has(j)) {
            rockMap.set(j, [] as Pos[]);
        }

        rockMap.get(j)!.push(rock);
    }

    let step = 0;
    while (changed) {
        changed = false;
        for (const [i, rock] of rocks.entries()) {
            const [y, x] = rock;
            if (y - 1 >= 0 && matrix[y - 1][x] === ".") {
                const otherRocks = rockMap.get(x)!.filter(p => p[0] === y - 1);
                if (!otherRocks?.length) {
                    rocks[i][0] = y - 1;
                    rocks[i][1] = x;
                    changed = true;
                }
            }
        }

        step++;
    }

    console.log("👽 Steps:", step);
}

export function printRocks(rocks: Pos[]) {
    for (const rock of rocks) {
        const [i, j] = rock;
        const [xOffset, yOffset] = screenOffset;
        ansi.gotoxy(j + xOffset, i + yOffset);
        ansi.write(ansi.fg.red + "O");
    }
}

export function printMatrix2(matrix: string[][], rocks: Pos[]) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const [xOffset, yOffset] = screenOffset;
            ansi.gotoxy(j + xOffset, i + yOffset);

            ansi.write(ansi.fg.white + matrix[i][j]);
        }
    }

    printRocks(rocks);
}

export function printMatrix(matrix: string[][], rocks: Pos[]) {
    const m = matrix;
    const rockMap = new Map<string, Pos>();
    for (const rock of rocks) {
        const [i, j] = rock;
        const key = `${i},${j}`;
        if (!rockMap.has(key)) {
            rockMap.set(key, rock);
        }
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const key = `${i},${j}`;
            const rock = rockMap.get(key);
            if (rock) {
                fmt.printf("%s%s", ansi.fg.white, "O");
            } else if (m[i][j] === "#") {
                fmt.printf("%s%s", ansi.fg.green, m[i][j]);
            } else {
                fmt.printf("%s%s", ansi.fg.darkgray, m[i][j]);
            }
        }
        fmt.printf("%s  %s", ansi.fg.white, (matrix.length - i).toString().padStart(4, " "));
        fmt.printf("\n");
    }
    fmt.printf("%s\n", ansi.fg.white);
}