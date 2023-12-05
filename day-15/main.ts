import { readFileSync } from "node:fs";
import * as fmt from "https://deno.land/std@0.209.0/fmt/printf.ts";


export const sampleInput01 = ["HASH"];
export const sampleInput02 = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7".split(",");

const Operation: Record<string, string> = {
    "-": "remove",
    "=": "replace",
};

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split(",").filter(Boolean);
    const p1 = part1(input);
    console.log("🦊>>>> ~ p1:", p1)

    const p2 = part2(input);
    console.log("🦊>>>> ~ p2:", p2)
}

function part1(input: string[]): number {
    let load = 0;

    for (const word of input) {
        console.log("🦊>>>> ~ part1 ~ hash(word):", hash(word))
        load += hash(word);
    }
    return load;
}

type Lense = [string, number];
function part2(input: string[]): number {
    const boxes = Array.from({ length: 256 }, (_) => [] as Lense[]);

    for (const step of input) {
        const match = step.match(/(\w+)(-|=)(\d*)/);

        if (!match) continue;

        const [, label, op, num] = match;
        const boxIdx = hash(label);

        performOperation(boxes, boxIdx, op, label, parseInt(num));

        // console.log("🦄 After:", step);
        // for (const [i, box] of boxes.entries()) {
        //     box?.length && console.log(`🦊>[${i}]:`, box)
        // }
    }

    let sum = 0;
    for( let i = 0; i < boxes.length; i++) {
        const boxNum = i + 1;
        const lenses = boxes[i];
        if (!lenses?.length) continue;

        for (let j = 0; j < lenses.length; j++) {
            const [label, focalLength ] = lenses[j];
            const lenseSlot = j + 1;
            const focusPower = lenseSlot * boxNum * focalLength;
            console.log(`🦄 ${label} => ${boxNum} * ${lenseSlot} * ${focalLength} = `, focusPower);

            sum += focusPower;
        }
    }
    return sum;
}

function performOperation(boxes: Lense[][], boxIdx: number, op: string, targetLabel: string, targetNum: number) {
    if (Operation[op] === "remove") {
        const lenses = boxes[boxIdx];
        boxes[boxIdx] = lenses.filter(([label, _num]) => label !== targetLabel);
    } else if (Operation[op] === "replace") {
        const lenses = boxes[boxIdx];

        const exists = lenses.find(([label, _]) => label === targetLabel);

        if (exists) {
            boxes[boxIdx] = lenses.map(([label, num]) => {
                if (label === targetLabel) return [targetLabel, targetNum];
                return [label, num];
            });
        } else {
            boxes[boxIdx].push([targetLabel, targetNum]);
        }
    }
}

function hash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
        hash *= 17;

        hash = hash % 256;
    }

    return hash;
}