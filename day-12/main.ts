import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "???.### 1,1,3",
    ".??..??...?##. 1,1,3",
    "?#?#?#?#?#?#?#? 1,3,1,6",
    "????.#...#... 4,1,1",
    "????.######..#####. 1,6,5",
    "?###???????? 3,2,1",
];

type Problem = (1 | 0 | null)[];
type Condition = number[];
type Answer = (1 | 0)[];
type Line = [Problem, Condition];

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);

    const p1 = part1(input);
    console.log("🦊>>>> part1", p1)
}

function part1(input: string[]): number {

    const lines = parseLines(input);
    let sum = 0;
    for (const [problem, condition] of lines) {
        const numAns = numSolutions(problem, condition);
        sum += numAns;
    }
    return sum;
}

function numSolutions(problem: Problem, condition: Condition) {
    let sum = 0;
    // find the null indices
    const questionIndices: number[] = problem
        .map((c, i) => c === null ? i : null)
        .filter(c => c !== null) as number[];

    for (const ans of findPairs(questionIndices.length)) {
        const answer = applySolution(problem, ans, questionIndices);

        const result = evaluate(answer, condition);
        if (result) {
            sum++;
        }
    }

    return sum;
}

function applySolution(problem: Problem, ans: number[], questionIndices: number[]): Answer {
    const problemCopy = problem.slice();
    for (let i = 0; i < ans.length; i++) {
        const targetIdx = questionIndices[i];

        //@ts-ignore
        problemCopy[targetIdx] = ans[i];
    }
    return problemCopy as Answer;
}

function evaluate(ans: Answer, condition: number[]) {
    const continuosBlocks = findContinuousBlockLengths(ans);

    return equalArray(continuosBlocks, condition);
}

function findContinuousBlockLengths(arr: number[]): number[] {
    const lengths: number[] = [];
    let currentLength = 0;

    for (const num of arr) {
        if (num === 1) {
            currentLength++;
        } else if (currentLength > 0) {
            lengths.push(currentLength);
            currentLength = 0;
        }
    }

    if (currentLength > 0) {
        lengths.push(currentLength);
    }

    return lengths;
}

function equalArray(arr1: number[], arr2: number[]): boolean {
    if (arr1?.length !== arr2?.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

function parseLines(lines: string[]): Line[] {
    return lines.map(line => {
        const [problemRaw, conditionRaw] = line.split(" ");
        const problem: Problem = problemRaw.split("").map(c => {
            if (c === "#") return 1;
            if (c === ".") return 0;

            return null;
        });

        const condition = conditionRaw.split(",").map(Number);
        return [problem, condition];
    });
}


export function* findPairs(size: number) {
    const max = 2 ** size;
    for (let i = 0; i < max; i++) {
        const str = i.toString(2).padStart(size, "0");
        yield str.split("").map(Number);;
    }
}