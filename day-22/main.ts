import { green } from "https://deno.land/std@0.209.0/fmt/colors.ts";
import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";

export const sampleInput01 = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`;

type Pos = [number, number, number];
type Block = { min: Pos, max: Pos, label: string };

if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const blocks = parseInput(rawInput);
    console.log("🦊>>>> ~ blocks:", blocks)
    const p1 = part1(blocks);
    console.log("🦊>>>> ~ p1:", p1)
}

function part1(blocks: Block[]): number {

    let step = 0;

    let changed = true;
    while (changed) {
        changed = false;

        for (let i = 0; i < blocks.length; i++) {
            const moved = gravity(blocks[i]);
            if (moved.min[2] < 1) {
                continue;
            }

            const collided = blocks.some((b, j) => {
                if (i === j) return false;
                const coll = isCollision(moved, b);
                return coll;
            });

            if (!collided) {
                blocks[i] = moved;
                changed = true;
            }
        }

        step++;
    }
    console.log("🦊> STABLE after:", step)

    return blocks.reduce((c, b, i) => {
        const can = canBeMoved(blocks, i);
        // console.log("🐌>: ", b.label, can);

        if (can) {
            return c + 1;
        }

        return c;
    }, 0);
}

function canBeMoved(blocksSrc: Block[], blockIdx: number): boolean {
    const blocks = blocksSrc.slice(0);
    blocks.splice(blockIdx, 1);

    let changed = true;
    while (changed) {
        changed = false;

        for (let i = 0; i < blocks.length; i++) {
            const moved = gravity(blocks[i]);
            if (moved.min[2] < 1) {
                continue;
            }

            const collided = blocks.some((b, j) => {
                if (i === j) return false;
                const coll = isCollision(moved, b);
                return coll;
            });

            if (!collided) {
                changed = true;
                return false;
            }
        }
    }

    return true;
}

function gravity(b: Block): Block {
    const min: Pos = [...b.min];
    const max: Pos = [...b.max];
    min[2]--;
    max[2]--;

    return {
        min,
        max,
        label: b.label,
    }
}

function isCollision(box1: Block, box2: Block) {
    // Check for collision along the x-axis
    if (box1.max[0] < box2.min[0] || box1.min[0] > box2.max[0]) {
        return false;
    }

    // Check for collision along the y-axis
    if (box1.max[1] < box2.min[1] || box1.min[1] > box2.max[1]) {
        return false;
    }

    // Check for collision along the z-axis
    if (box1.max[2] < box2.min[2] || box1.min[2] > box2.max[2]) {
        return false;
    }

    // If no axis separation, boxes overlap
    return true;
}


function parseInput(input: string): Block[] {
    const blocks = input
        .trim()
        .split("\n")
        .map((line, i) => {
            const [left, right] = line.split("~");
            const min = left.split(",").map(Number) as Pos;
            const max = right.split(",").map(Number) as Pos;
            const label = String.fromCharCode(65 + i);

            return { min, max, label };
        });

    return blocks.sort((a, b) => {
        const [, , z0] = a.max;
        const [, , z1] = b.max;

        return z0 - z1;
    })
}
