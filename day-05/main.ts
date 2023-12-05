import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "seeds: 79 14 55 13",
    "",
    "seed-to-soil map:",
    "50 98 2",
    "52 50 48",
    "",
    "soil-to-fertilizer map:",
    "0 15 37",
    "37 52 2",
    "39 0 15",
    "",
    "fertilizer-to-water map:",
    "49 53 8",
    "0 11 42",
    "42 0 7",
    "57 7 4",
    "",
    "water-to-light map:",
    "88 18 7",
    "18 25 70",
    "",
    "light-to-temperature map:",
    "45 77 23",
    "81 45 19",
    "68 64 13",
    "",
    "temperature-to-humidity map:",
    "0 69 1",
    "1 0 69",
    "",
    "humidity-to-location map:",
    "60 56 37",
    "56 93 4",
].join("\n");

interface Range {
    source: number;
    dest: number;
    length: number;
};

interface MMap {
    name: string;
    ranges: Range[];
}

export function parseMap(text: string): MMap {
    const [name, rest] = text.split(":");
    const ranges: Range[] = rest.trim().split("\n").map(li => {
        const [dest, source, length] = li.split(" ").map(Number);

        return { source, dest, length };
    }).toSorted((a, b) => {
        return a.source - b.source;
    });

    const res = {
        name: name.split(" ")[0],
        ranges,
    }

    return res;
}

function* interval(ini: number, length: number): Generator<number> {
    for (let i = 0; i < length; i++) {
        yield ini + i;
    }
}

function* arrayToGenerator(arr: number[]): Generator<number> {
    for (const num of arr) {
        yield num;
    }
}

export function part01(text: string) {
    const { seeds, maps } = parseText(text);
    const minPart1 = processSeeds(arrayToGenerator(seeds), maps);

    return minPart1;
}


export function part02(text: string) {
    const { seeds, maps } = parseText(text);

    // chunk seeds in pairs of values
    const seedRanges = seeds.reduce((acc, curr, i) => {
        if (i % 2 === 0) {
            acc.push([curr]);
        } else {
            acc[acc.length - 1].push(curr);
        }
        return acc;
    }, [] as number[][]);

    let min = Number.MAX_VALUE;
    for (const seedRange of seedRanges) {
        const [start, length] = seedRange;

        const seedVals = interval(start, length);
        const localMin = processSeeds(seedVals, maps);
        console.log(localMin)

        min = Math.min(min, localMin);
    }

    return min;
}

function parseText(text: string) {
    const [seedsRaw, ...mapsRaw] = text.split("\n\n");
    const maps = mapsRaw.map(parseMap);

    const seeds = seedsRaw.split(" ").slice(1).map(Number);
    return { seeds, maps };
}

function processSeeds(seeds: Generator<number>, maps: MMap[]): number {
    let minVal = Number.MAX_VALUE;

    for (const seed of seeds) {
        let curr = seed;
        for (const map of maps) {

            let newVal = null;
            for (const { source, dest, length } of map.ranges) {
                if (curr >= source && curr < source + length) {
                    newVal = dest + (curr - source);
                    break;
                }

                if (curr < source) {
                    break;
                }
            }

            newVal = newVal !== null ? newVal : curr;
            curr = newVal;
        }

        if (curr < minVal) {
            minVal = curr;
        }
    }

    return minVal;
}

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" });

    const p1 = part01(input);
    console.log("part1=", p1);

    const p2 = part02(input);
    console.log("part2=", p2);
}
