import { readFileSync } from "node:fs";

export const sampleInput11 = [
    "RL",
    "",
    "AAA = (BBB, CCC)",
    "BBB = (DDD, EEE)",
    "CCC = (ZZZ, GGG)",
    "DDD = (DDD, DDD)",
    "EEE = (EEE, EEE)",
    "GGG = (GGG, GGG)",
    "ZZZ = (ZZZ, ZZZ)",
].join("\n");

export const sampleInput12 = [
    "LLR",
    "",
    "AAA = (BBB, BBB)",
    "BBB = (AAA, ZZZ)",
    "ZZZ = (ZZZ, ZZZ)",
].join("\n");

export const sampleInput21 = [
    "LR",
    "",
    "11A = (11B, XXX)",
    "11B = (XXX, 11Z)",
    "11Z = (11B, XXX)",
    "22A = (22B, XXX)",
    "22B = (22C, 22C)",
    "22C = (22Z, 22Z)",
    "22Z = (22B, 22B)",
    "XXX = (XXX, XXX)",
].join("\n");


export function part01(text: string) {
    const [instructions, nodes] = parseInput(text);

    let currKey = "AAA";
    let currNode = nodes.get(currKey);
    let instrPtr = 0;

    while (currKey !== "ZZZ") {
        const instr = instructions[instrPtr % instructions.length];
        console.log("🦄", currKey, "=", currNode, instr);
        //@ts-ignore
        const [left, right] = currNode;

        if (instr === "L") {
            currKey = left;
        } else {
            currKey = right;
        }
        currNode = nodes.get(currKey);
        instrPtr++;
    }
    return instrPtr;
}

export function part02(text: string) {
    const [instructions, nodes] = parseInput(text);

    const currKeys = [...nodes.keys()].filter((k) => k.endsWith("A"));
    console.log("🦊>>>> ~ part02 ~ currKeys:", currKeys)
    const currNodes = currKeys.map(ck => nodes.get(ck));
    let instrPtr = 0;
    const zs: number[][] = currKeys.map(() => []);

    while (!currKeys.every((k) => k.endsWith("Z"))) {

        const instr = instructions[instrPtr % instructions.length];
        for (const [i, currNode] of currNodes.entries()) {
            //@ts-ignore
            const [left, right] = currNode;

            if (instr === "L") {
                currKeys[i] = left;
            } else {
                currKeys[i] = right;
            }
            currNodes[i] = nodes.get(currKeys[i]);

            if (currKeys[i].endsWith("Z")) {
                zs[i].push(instrPtr);
            }
        }

        if (zs.every((zs) => zs.length >= 2)) {
            return findLCMOfArray(zs.map((zs) => zs[1] - zs[0]));
        }

        instrPtr++;
    }

    return instrPtr;
}

export function parseInput(text: string): [string[], Map<string, string[]>] {
    const [instructionsRaw, nodesRaw] = text.split("\n\n");

    const nodes = new Map<string, string[]>();
    const instructions = instructionsRaw.split("");
    for (const nodeRaw of nodesRaw.split("\n")) {
        const [[_, node, left, right]] = [...nodeRaw.matchAll(/^(\w+) = \((\w+), (\w+)\)$/g)];
        nodes.set(node, [left, right]);
    }

    return [instructions, nodes];
}

function findLCMOfArray(numbers: number[]): number {
    return numbers.reduce((acc, num) => findLCM(acc, num), 1);
}

function findLCM(a: number, b: number): number {
    return (a * b) / findGCD(a, b);
}

function findGCD(a: number, b: number): number {
    return b === 0 ? a : findGCD(b, a % b);
}


if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" });
    const p1 = part01(input);
    console.log("part1=", p1);

    const p2 = part02(input);
    console.log("part2=", p2);
}
