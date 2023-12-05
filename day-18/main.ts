import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";


export const sampleInput01 = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`;

export const sampleInput02 = `
L 6 (#70c710)
D 5 (#0dc571)
R 2 (#5713f0)
D 2 (#d2c081)
L 2 (#59c680)
D 2 (#411b91)
R 5 (#8ceee2)
U 2 (#caa173)
R 1 (#1b58a2)
U 2 (#caa171)
L 2 (#7807d2)
U 3 (#a77fa3)
R 2 (#015232)
U 2 (#7a21e3)
`;

type Line = [string, number, string];
type Pos = [number, number];
type Dir = [number, number];



const DirMap: Record<string, Dir> = {
    "U": [-1, 0],
    "D": [1, 0],
    "L": [0, -1],
    "R": [0, 1],
};

class Matrix {
    data: string[][] = Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => "."));;
    nRows = 0;
    nCols = 0;

    constructor(m: number = 0, n: number = 0) {
        this.nRows = m;
        this.nCols = n;
        this.data = Array.from({ length: m }, () => Array.from({ length: n }, () => "."));
    }

    get(row: number, col: number): string {
        return this.data[row][col];
    }

    put(row: number, col: number, value: string): void {
        if (row >= this.nRows) {
            this.data.push(Array.from({ length: 1000 }, () => "."));
            this.nRows++;
        }
        if (col >= this.nCols) {
            this.data[row].push(".");
            this.nCols++;
        }

        if (!this.data[row]) {
            console.log("🦊>>>> ~ put ~ this.data[row] is undefined:", row, col, value);
            this.print();
            Deno.exit();
            this.data[row] = Array.from({ length: 1000 }, () => ".");
        }

        this.data[row][col] = value;
    }

    print(): void {
        for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
                printf("%s", this.data[i][j]);
            }
            printf("\n");
        }
    }
}


if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });
    const input = parseInput(rawInput);
    const p1 = part1(input);
    console.log("🦊>>>> ~ p1:", p1)
}

function part1(lines: Line[]): number {
    let cursor: Pos = [0, 0];
    let iMin = 0, iMax = 0, jMin = 0, jMax = 0;
    for (const [i, line] of lines.entries()) {
        console.log(i + 1, "👁️>:", line)
        cursor = simStep(line, cursor);
        const [currI, currJ] = cursor;
        if (currI < iMin) {
            iMin = currI;
        }
        if (currI > iMax) {
            iMax = currI;
        }
        if (currJ < jMin) {
            jMin = currJ;
        }
        if (currJ > jMax) {
            jMax = currJ;
        }
    }
    console.log("🦊>>>> ~ :", { iMin, iMax, jMin, jMax })
    const offset: Pos = [0, 0];
    if (iMin < 0) {
        offset[0] = Math.abs(iMin);
    }
    if (jMin < 0) {
        offset[1] = Math.abs(jMin);
    }
    console.log("🦊>>>> ~ part1 ~ offset:", offset)
    const totalRows = iMax - iMin + 1;
    const totalCols = jMax - jMin + 1;
    const matrix = new Matrix(totalRows, totalCols);

    cursor = offset;
    matrix.put(cursor[0], cursor[1], "#");

    for (const [i, line] of lines.entries()) {
        console.log(i + 1, "👁️>:", line)

        cursor = execStep(matrix, line, cursor);
    }

    const middleRow = Math.floor(totalRows / 2);
    const middleCol = Math.floor(totalCols / 2);
    console.log(`🦊>>>> middle [${middleRow}][${middleCol}]=`, matrix.get(middleRow, middleCol));
    floodFill(matrix, middleRow, middleCol);

    matrix.print();

    const sum = matrix.data
        .map(row => row.reduce((acc, val) => acc + (val === "#" ? 1 : 0), 0))
        .reduce((acc, val) => acc + val, 0);

    return sum;
}

function simStep(line: Line, iniCursor: Pos): Pos {
    const [dir, steps, _] = line;
    const [row, col] = iniCursor;
    const dirVec = DirMap[dir];

    let i = row;
    let j = col;
    for (let s = 0; s < steps; s++) {
        i += dirVec[0];
        j += dirVec[1];
    }
    console.log("👁️ >: end-cursor", i, j)

    return [i, j];
}

function execStep(matrix: Matrix, line: Line, iniCursor: Pos): Pos {
    const [dir, steps, _] = line;
    const [row, col] = iniCursor;
    const dirVec = DirMap[dir];

    let i = row;
    let j = col;
    for (let s = 0; s < steps; s++) {
        i += dirVec[0];
        j += dirVec[1];

        matrix.put(i, j, "#");
    }

    // console.log("👁️ >: end-cursor", i, j)
    // matrix.print();

    return [i, j];
}

export function parseInput(input: string): Line[] {
    return input.split("\n").filter(li => li.trim()).map(parseLine);
}
export function parseLine(lineRaw: string): Line {
    const [dir, numRaw, colorRaw] = lineRaw
        .trim()
        .split(" ");

    return [dir, parseInt(numRaw), colorRaw.split(/\(|\)/)[1]];
}



function floodFill(matrix: Matrix, startRow: number, startCol: number): void {
    const nrows = matrix.nRows;
    const ncols = matrix.nCols;
    const queue: [number, number][] = [];

    const isValidCell = (row: number, col: number): boolean => {
        return row >= 0 && row < nrows && col >= 0 && col < ncols && matrix.get(row, col) === ".";
    };

    queue.push([startRow, startCol]);

    while (queue.length > 0) {
        const [row, col] = queue.shift()!;

        if (!isValidCell(row, col)) {
            continue;
        }

        matrix.put(row, col, "#");

        // Add neighboring cells to the queue
        queue.push([row - 1, col]); // Up
        queue.push([row + 1, col]); // Down
        queue.push([row, col - 1]); // Left
        queue.push([row, col + 1]); // Right
    }
}
