import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "Time:      7  15   30",
    "Distance:  9  40  200",
];
export const sampleInput02 = [
    "Time:      7",
    "Distance:  9",
];

export function part01_and_02(lines: string[]) {
    const timeAr = lines[0].trim().split(/\s+/).slice(1).map(Number);
    const distAr = lines[1].trim().split(/\s+/).slice(1).map(Number);
    const part1 = computeScore(timeAr, distAr);

    const part2Times = [Number.parseInt(lines[0].trim().split(/\s+/).slice(1).join(""))];
    const part2Dists = [Number.parseInt(lines[1].trim().split(/\s+/).slice(1).join(""))];

    const part2 = computeScore(part2Times, part2Dists);

    return [part1, part2];
}

function computeScore(timeAr: number[], distAr: number[]): number {
    console.log("🦊>>>> ~ computeScore ~ distAr:", distAr)
    console.log("🦊>>>> ~ computeScore ~ timeAr:", timeAr)
    let res = 1;
    for (let i = 0; i < timeAr.length; i++) {
        const time = timeAr[i];
        const dist = distAr[i];

        let targetSpeed = NaN;
        for (let speed = 1; speed < time; speed++) {
            const availableTime = time - speed;
            const traveled = availableTime * speed;

            if (traveled > dist) {
                targetSpeed = speed;
                break;
            }
        }

        const ways = (time + 1) - targetSpeed * 2;
        res *= ways;
    }
    return res;
}

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
    const [p1, p2] = part01_and_02(input);

    console.log("part1=", p1);
    console.log("part2=", p2);
}