import { readFileSync } from "node:fs";

export const sampleInput11 = [
    "0 3 6 9 12 15",
    "1 3 6 10 15 21",
    "10 13 16 21 30 45",
];

export function part01(lines: string[]) {
    let total = 0;
    for (const line of lines) {
        const array = line.split(/\s+/).map(Number);
        const pyramid = buildPyramid(array);
        const next = extrapolateNext(pyramid);

        total += next;
    }
    return total;
}

export function part02(lines: string[]) {
    let total = 0;
    for (const line of lines) {
        const array = line.split(/\s+/).map(Number);
        const pyramid = buildPyramid(array);
        const next = extrapolateFirst(pyramid);

        total += next;
    }
    return total;
}

function extrapolateNext(pyramid: number[][]): number {
    const next = pyramid.reduceRight((acc, curr) => {
        const last = curr.at(-1) as number;
        const res = acc + last;

        return res;
    }, 0);
    return next;
}

function extrapolateFirst(pyramid: number[][]): number {
    const next = pyramid.reduceRight((acc, curr) => {
        const last = curr.at(0) as number;
        const res = last - acc;

        return res;
    }, 0);

    return next;
}

function buildPyramid(array: number[]) {
    const pyramid: number[][] = [];
    pyramid.push(array);
    let curr = array;
    for (; ;) {
        if (curr.every(v => v === 0)) break;

        const diffs = curr.map((v, i) => curr[i + 1] - v).slice(0, curr.length - 1);
        pyramid.push(diffs);

        curr = diffs;
    }
    return pyramid;
}

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
    // const p1 = part01(input);
    // console.log("part1=", p1);

    const p2 = part02(input);
    console.log("part2=", p2);
}
