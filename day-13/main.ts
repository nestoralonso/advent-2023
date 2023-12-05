import { readFileSync } from "node:fs";

export const sampleInput01 = [
    `
    #.##..##.
    ..#.##.#.
    ##......#
    ##......#
    ..#.##.#.
    ..##..##.
    #.#.##.#.
    `.split("\n").map(s => s.trim()).filter(Boolean).join("\n"),
    `
    #...##..#
    #....#..#
    ..##..###
    #####.##.
    #####.##.
    ..##..###
    #....#..#
    `.split("\n").map(s => s.trim()).filter(Boolean).join("\n")
];


if (import.meta.main) {
    const matrixAr = readFileSync("./input.txt", { encoding: "utf8" }).split("\n\n").filter(Boolean);

    const p1 = part1(sampleInput01);
    console.log("🦊>>>> part1", p1)
}

function part1(matricesRaw: string[]): number {

    const matrices = matricesRaw.map(raw => parseMatrix(raw));
    console.log("🦄>>>>problems:", matrices.length)
    let sum = 0;
    for (const [i, m] of matrices.entries()) {
        const nrows = m.length;
        const ncols = m[0].length;

        const res = findHorizontalMirror(m);
        if (res > -1) {
            console.log("👀>: horz", res)
            printSolvedMatrix(m, "horizontal", res);
            sum += res * 100;
        } else {
            const res = findVerticalMirror(m);
            console.log("👀>: vert", res)
            printSolvedMatrix(m, "vertical", res);

            if (res > -1) {
                sum += res;
            } else {
                console.log(`\n💀😱😱>>>>${i}:`, { nrows, ncols })
                printMatrix(m);
                console.log(`🐶>${i} TRANSPOSED:`)
                printMatrix(transposeMatrix(m));

                Deno.exit(1);
            }
        }
    }

    return sum;
}

function findHorizontalMirror(m: string[][]): number {
    for (let i = m.length - 1; i >= 1; i--) {
        const mirrorLine = i;
        const isM = isMirrorHorizontal(m, mirrorLine);
        if (isM) {
            return mirrorLine;
        }
    }

    return -1;
}

function isMirrorHorizontal(m: string[][], mirrorLine: number) {
    if (mirrorLine === 0 || mirrorLine === m.length) {
        return false;
    }
    const nrows = m.length;

    const startOffset = Math.min(mirrorLine, nrows - mirrorLine);

    let bottomIdx = mirrorLine - startOffset;
    let topIdx = mirrorLine + startOffset - 1;
    while (true) {
        const bottom = m[bottomIdx];
        const top = m[topIdx];
        const eq = equalArrays(bottom, top);

        if (!eq) return false;
        bottomIdx++;
        topIdx--;

        if (bottomIdx >= topIdx) {
            break;
        }
    }

    return true;
}

function findVerticalMirror(m: string[][]): number {
    const nCols = m[0].length;
    for (let j = nCols - 1; j >= 1; j--) {
        const mirrorLine = j;
        const isM = isMirrorVertical(m, mirrorLine);
        if (isM) {
            return mirrorLine;
        }
    }

    return -1;
}

function isMirrorVertical(m: string[][], mirrorLine: number) {
    const nCols = m[0].length;
    if (mirrorLine === 0 || mirrorLine === nCols) {
        return false;
    }

    const startOffset = Math.min(mirrorLine, nCols - mirrorLine);

    let leftIdx = mirrorLine - startOffset;
    let rightIdx = mirrorLine + startOffset - 1;

    while (true) {
        const eq = equalCols(m, leftIdx, rightIdx);

        if (!eq) return false;
        leftIdx++;
        rightIdx--;

        if (leftIdx >= rightIdx) {
            break;
        }
    }

    return true;
}

function parseMatrix(matrixRaw: string): string[][] {
    return matrixRaw.split("\n").map(s => s.split(""));
}

export function printMatrix(matrix: string[][]) {
    for (const row of matrix) {
        console.log(row.join(" "));
    }
}

type Type = "horizontal" | "vertical";
export function printSolvedMatrix(matrix: string[][], type: Type, idx: number) {
    if (type === "horizontal") {
        for (const [i, row] of matrix.entries()) {
            const prefix = i < idx ? "🟩" : "🟦";
            console.log(prefix + row.join(" "));
        }

        return;
    }

    const firstLine = matrix[0].map((_s, i) => i < idx ? "🟩" : "🟦");
    console.log(firstLine.join(""));

    for (const row of matrix) {
        console.log(row.join(" "));
    }

}

function equalArrays(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}


function equalCols(matrix: string[][], idx1: number, idx2: number) {
    if (matrix.length !== matrix.length) {
        return false;
    }
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][idx1] !== matrix[i][idx2]) {
            return false;
        }
    }
    return true;
}

function transposeMatrix(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}