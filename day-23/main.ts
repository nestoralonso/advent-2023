// deno-lint-ignore-file prefer-const
import { green } from "https://deno.land/std@0.209.0/fmt/colors.ts";
import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";

export const sampleInput01 = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;

type Graph = { [key: string]: { [key: string]: number } };
type Pos = [number, number];
type Matrix = string[][];
const Dirs: { [key: string]: number[][] } = {
    "^": [[-1, 0]],
    "v": [[1, 0]],
    "<": [[0, -1]],
    ">": [[0, 1]],
    ".": [[-1, 0], [1, 0], [0, -1], [0, 1]],
};


if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const [matrix, points] = parseInput(rawInput);
    const [start, end ] = points;
    console.log("🦄", start, end)
    printMatrix(matrix);
    console.log("🦊>>>> ~ :", points.length, points)

    const p1 = part1(matrix, points);
    console.log("🦊>>>> ~ p1:", p1)
}


function part1(matrix: Matrix, points: Pos[]): number {

    const graph: Graph = buildGraph(matrix, points);
    const [start, end] = points;

    const seenDfs: Set<string> = new Set();
    const res = dfs(start, end, graph, seenDfs);

    return res;
}

function buildGraph(matrix: Matrix, points: Pos[]) {
    const graph: Graph = {};

    for (const [si, sj] of points) {
        const stack = [[0, si, sj]];
        const seen = new Set<string>();
        const sKey = `${si}-${sj}`;
        seen.add(sKey);

        while (stack.length > 0) {
            const [n, i, j] = stack.pop()!;

            if (n !== 0 && points.find((x) => x[0] === i && x[1] === j)) {
                if (!graph[sKey]) {
                    graph[sKey] = {};
                }
                graph[sKey][`${i}-${j}`] = n;
                continue;
            }

            const cell = matrix[i][j];

            for (const [di, dj] of Dirs[cell]) {
                const ni = i + di;
                const nj = j + dj;
                const nKey = `${ni}-${nj}`;
                if (ni >= 0 && ni < matrix.length && nj >= 0 && nj < matrix[0].length
                    && matrix[ni][nj] !== "#" && !seen.has(nKey)) {
                    stack.push([n + 1, ni, nj]);
                    seen.add(nKey);
                }
            }
        }
    }
    return graph;
}

function parseInput(input: string): [Matrix, Pos[]] {
    const rowsRaw = input
        .trim()
        .split("\n");
    const nRows = rowsRaw.length;

    const matrix = rowsRaw
        .map((li) => {
            return li.split("");
        });
    const nCols = matrix[0].length;

    const start: Pos = [0, matrix[0].indexOf(".")];
    const end: Pos = [nRows - 1, matrix[nRows - 1].indexOf(".")];
    const points: Pos[] = [start, end];


    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (matrix[i][j] === "#") {
                continue;
            }

            let neighbors = 0;
            for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < nRows && nj >= 0 && nj < nCols && matrix[ni][nj] !== "#") {
                    neighbors += 1;
                }
            }
            if (neighbors >= 3) {
                const pos: Pos = [i, j];
                points.push(pos);
            }

        }

    }

    return [matrix, points];
}

function dfs(start: Pos, end: Pos, graph: Graph, seenDfs: Set<string>): number {
    const [i, j] = start;
    if (i === end[0] && j === end[1]) {
        return 0;
    }

    let m = -Infinity;
    const key = `${i}-${j}`;

    seenDfs.add(key);
    for (const nx in graph[key]) {
        const [ni, nj] = nx.split('-').map(Number);
        if (!seenDfs.has(nx)) {
            m = Math.max(m, dfs([ni, nj], end, graph, seenDfs) + graph[key][nx]);
        }
    }

    seenDfs.delete(key);

    return m;
}

function printMatrix(matrix: Matrix) {
    const nRows = matrix.length;
    const nCols = matrix[0].length;

    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            printf("%s", matrix[i][j]);
        }

        printf("\n");
    }
}