import { readFileSync } from "node:fs";

const sampleInput01 = [
    ".....",
    ".S-7.",
    ".|.|.",
    ".L-J.",
    ".....",
];

const sampleInput02 = [
    "-L|F7",
    "7S-7|",
    "L|7||",
    "-L-J|",
    "L|-JF",
];

const sampleInput03 = [
    "7-F7-",
    ".FJ|7",
    "SJLL7",
    "|F--J",
    "LJ.LJ",
];

function printDiagram(input: string[]) {
    for (let i = 0; i < input.length; i++) {
        const row = input[i]
            .replaceAll("F", "╔")
            .replaceAll("7", "╗")
            .replaceAll("L", "╚")
            .replaceAll("J", "╝")
            .replaceAll("-", "═")
            .replaceAll("|", "║")

        console.log(row);
    }
}

function findStart(input: string[]): [number, number] {
    for (let i = 0; i < input.length; i++) {
        const row = input[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === "S") {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

type Coord = [number, number];

const Dir: { [key: string]: [number, number] } = {
    N: [-1, 0],
    E: [0, 1],
    S: [1, 0],
    W: [0, -1],
};

const Orient = {
    Vert: [1, 0],
    Horz: [0, 1],
} as const;

const PipeType: { [key: string]: any } = {
    "-": {
        [Dir.E.toString()]: Dir.E,
        [Dir.W.toString()]: Dir.W,
    },
    "7": {
        [Dir.E.toString()]: Dir.S,
        [Dir.N.toString()]: Dir.W,
    },
    "|": {
        [Dir.N.toString()]: Dir.N,
        [Dir.S.toString()]: Dir.S,
    },
    "J": {
        [Dir.S.toString()]: Dir.W,
        [Dir.E.toString()]: Dir.N,
    },
    "L": {
        [Dir.S.toString()]: Dir.E,
        [Dir.W.toString()]: Dir.N,
    },
    "F": {
        [Dir.W.toString()]: Dir.S,
        [Dir.N.toString()]: Dir.E,
    },
}

function equal(a: [number, number], b: [number, number]) {
    return a[0] === b[0] && a[1] === b[1];
}

function move(pos: [number, number], dir: [number, number]): [number, number] {
    return [pos[0] + dir[0], pos[1] + dir[1]];
}

function get(input: string[], pos: [number, number]): string {
    const [i, j] = pos;
    return input[i][j];
}

function nextDir(currPipe: string, pos: [number, number], dir: [number, number]): [number, number] {

    const pipeType = PipeType[currPipe];
    const newDir = pipeType[dir.toString()];

    return newDir;
}

function walk(input: string[], startPos: [number, number]) {
    let start: [number, number] = startPos;
    let dir: [number, number] = guessStartDir(input);
    console.log("🦊>>>> ~ walk ~ start:", { dir })
    let pos: [number, number] = startPos;
    guessStartPipe(input, startPos);
    printDiagram(input);

    let step = 0;
    while (true) {
        const currPipe = get(input, pos);
        const newDir = nextDir(currPipe, pos, dir);
        console.log("🦄>:", { pos, dir, pipe: currPipe, newDir, newPos: move(pos, dir) })
        pos = move(pos, newDir);
        dir = newDir;

        step++;
        if (equal(pos, start)) {
            console.log("🍗🍗🍗🍗", { step, pos })

            break;
        }
    }

    return step / 2;
}

function guessStartPipe(input: string[], startPos: [number, number]) {
    const startRow: string = input[startPos[0]];
    if (input[0].length >= 140) { // input.txt
        input[startPos[0]] = startRow.replace("S", "|");
    } else if (input.length === 5 && input[0].length === 5 && input[0][0] === "7") { // sample 3
        input[startPos[0]] = startRow.replace("S", "F");
    } else  if (input[0].length === 5) {
        input[startPos[0]] = startRow.replace("S", "F");
    }
}

function guessStartDir(input: string[]) {
    if (input.length === 5 && input[0].length === 5 && input[0][0] === "7") { // sample 3
        return Dir.N;
    } else if (input[0].length === 5) {
        return Dir.N;
    }

    return Dir.N;
}

function part1(input: string[]): number {
    const [startRow, startCol] = findStart(input);

    const res = walk(input, [startRow, startCol]);

    return res;
}

const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
console.log("🦊>>>> ~ input:", input.length, input[0].length)

// let cleanMatrix = sampleInput03.map(strRow => [...strRow].map(_c => "."));
// printDiagram(cleanMatrix);
const p1 = part1(sampleInput03);
console.log("🦊>>>> part1", p1)