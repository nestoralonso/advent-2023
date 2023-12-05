import { readFileSync } from "node:fs";
import * as fmt from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { white, blue, red, green, gray, underline, strikethrough } from "https://deno.land/std@0.209.0/fmt/colors.ts";


export const sampleInput01 = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;

type Cave = string[][];
type Pos = { x: number, y: number };
type Dir = { x: number, y: number };
type Ray = { pos: Pos, dir: Dir };
type Orientation = "horz" | "vert";
const DeadRay: Ray = { pos: { x: -1, y: -1 }, dir: { x: 0, y: 0 } };

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" });
    // const p1 = part1(input);
    // console.log("🦊>>>> ~ p1:", p1)

    const p2 = part2(input);
    console.log("🦊>>>> ~ p2:", p2)

}

function isDeadRay(ray: Ray): boolean {
    return ray.pos.x < 0;
}

function orientation(dir: Dir): Orientation {
    if (dir.x == 0) {
        return "vert";
    } else if (dir.y == 0) {
        return "horz";
    } else {
        throw new Error("invalid direction");
    }
}

function parseCave(input: string): [Cave, Cave] {
    const cave = input
        .trim()
        .split("\n")
        .filter(li => li.trim()?.length > 0)
        .map(line => line.split(""));

    const energized = cave.map(row => row.map(_ => "."));
    return [cave, energized];
}

function part1(input: string): number {
    const [cave, energized] = parseCave(input);
    const rays: Ray[] = [newRay(0, 0, 1, 0)];

    const sum = computeTotalEnergized(rays, cave, energized);
    return sum;
}

function clearEnergized(energized: Cave) {
    for (let y = 0; y < energized.length; y++) {
        for (let x = 0; x < energized[y].length; x++) {
            energized[y][x] = ".";
        }
    }
}

function part2(input: string): number {
    const [cave, energized] = parseCave(input);
    const xRight = cave[0].length - 1;
    const yBottom = cave.length - 1;
    const nCols = cave[0].length;
    // iterate over the sides of the matrix
    let maxEnergized = -1;
    for (let y = 0; y < cave.length; y++) {
        clearEnergized(energized);
        const rays: Ray[] = [newRay(0, y, 1, 0)];
        const sum = computeTotalEnergized(rays, cave, energized);
        console.log("🦊>>>> ~ part2 ~ sum:", sum)

        if (sum > maxEnergized) {
            maxEnergized = sum;
        }
    }

    for (let y = 0; y < cave.length; y++) {
        clearEnergized(energized);
        const rays: Ray[] = [newRay(xRight, y, -1, 0)];
        const sum = computeTotalEnergized(rays, cave, energized);
        console.log("🦊>>>> ~ part2 ~ sum:", sum)

        if (sum > maxEnergized) {
            maxEnergized = sum;
        }
    }

    for (let x = 0; x < nCols; x++) {
        clearEnergized(energized);
        const rays: Ray[] = [newRay(x, 0, 0, 1)];
        const sum = computeTotalEnergized(rays, cave, energized);
        console.log("🦊>>>> ~ part2 ~ sum:", sum)

        if (sum > maxEnergized) {
            maxEnergized = sum;
        }
    }

    for (let x = 0; x < nCols; x++) {
        clearEnergized(energized);
        const rays: Ray[] = [newRay(x, yBottom, 0, -1)];
        const sum = computeTotalEnergized(rays, cave, energized);
        console.log("🦊>>>> ~ part2 ~ sum:", sum)

        if (sum > maxEnergized) {
            maxEnergized = sum;
        }
    }

    return maxEnergized;
}

function computeTotalEnergized(initRays: Ray[], cave: Cave, energized: Cave): number {
    let i = 0;
    let lastEnergized = 0;
    const rays = initRays.slice(0);

    while (true) {
        const newRays: Ray[] = [];
        for (const ray of rays) {
            const [ray_, newRay] = rayStep(ray, cave, energized);
            if (newRay && !isDeadRay(newRay)) {
                newRays.push(newRay);
            }

            ray.pos = ray_.pos;
            ray.dir = ray_.dir;
        }

        // fit the new rays in the Dead slots
        for (let i = 0; i < rays.length; i++) {
            if (isDeadRay(rays[i])) {
                rays[i] = newRays.pop() || DeadRay;
            }
        }
        rays.push(...newRays);

        i += 1;

        let currEnergized = 0;
        for (const row of energized) {
            for (const cell of row) {
                if (cell == "#") {
                    currEnergized += 1;
                }
            }
        }

        // if currEnergized hasnt changed in the last 10 iterations, we are done
        if (lastEnergized == currEnergized) {
            console.log("🦄: no change");
            break;
        }

        if (i % 77 == 0) { // check if numEnergized has stabilized
            lastEnergized = currEnergized;
        }

        // console.log("\n🦄>:", i, "rays:", rays.filter(r => r !== DeadRay).length, "dead: ", numDead, "energized", currEnergized);
    }

    // printMatrix(energized, []);
    let sum = 0;
    for (const row of energized) {
        for (const cell of row) {
            if (cell == "#") {
                sum += 1;
            }
        }
    }
    return sum;
}

function newRay(x: number, y: number, dx: number, dy: number): Ray {
    return {
        pos: { x, y },
        dir: { x: dx, y: dy }
    }
}

function energize(x: number, y: number, energized: Cave) {
    if (x >= 0 && y >= 0 && y < energized.length && x < energized[0].length) {
        energized[y][x] = "#";
    }
}
function rayStep(ray: Ray, cave: Cave, energized: Cave): [Ray, Ray?] {
    const { x, y } = ray.pos;

    energize(x, y, energized);

    const { x: dx, y: dy } = ray.dir;

    if (x < 0 || y < 0 || y >= cave.length || x >= cave[0].length) {
        return [DeadRay, DeadRay];
    }
    const ncell = cave[y][x];
    if (ncell == ".") {
        const [nx, ny] = [x + dx, y + dy];
        energize(nx, ny, energized);
        const newR = newRay(nx, ny, dx, dy);

        return [newR, DeadRay];
    }
    if (ncell == "|" && orientation(ray.dir) == "vert") {
        energize(x, y, energized);
        const [nx, ny] = [x + dx, y + dy];
        energize(nx, ny, energized);

        const newR = newRay(nx, ny, dx, dy);

        return [newR, DeadRay];
    }
    if (ncell == "|" && orientation(ray.dir) == "horz") {
        energize(x, y, energized);
        const ny1 = y - 1;
        const ny2 = y + 1;

        const newR1 = newRay(x, ny1, 0, -1);
        const newR2 = newRay(x, ny2, 0, 1);
        energize(x, ny1, energized);
        energize(x, ny2, energized);

        return [newR1, newR2];
    }
    if (ncell == "-" && orientation(ray.dir) == "horz") {
        const [nx, ny] = [x + dx, y + dy];
        energize(nx, ny, energized);
        const newR = newRay(nx, ny, dx, dy);

        return [newR, DeadRay];
    }
    if (ncell == "-" && orientation(ray.dir) == "vert") {
        const nx1 = x + 1;
        const nx2 = x - 1;

        const newR1 = newRay(nx1, y, 1, 0);
        const newR2 = newRay(nx2, y, -1, 0);
        energize(nx1, y, energized);
        energize(nx2, y, energized);

        return [newR1, newR2];
    }

    if (ncell == "/") {
        const dx_ = -dy;
        const dy_ = -dx;
        const [nx, ny] = [x + dx_, y + dy_];
        energize(nx, ny, energized);

        return [newRay(nx, ny, dx_, dy_), DeadRay]
    }
    if (ncell == "\\") {
        const dx_ = dy;
        const dy_ = dx;
        const [nx, ny] = [x + dx_, y + dy_];
        energize(nx, ny, energized);

        return [newRay(nx, ny, dx_, dy_), DeadRay]
    }

    return [DeadRay, DeadRay];
}


export function printMatrix(matrix: Cave, rays: Ray[]) {
    const m = matrix;
    const rayMap = new Map<string, Ray>();
    for (const ray of rays) {
        if (isDeadRay(ray)) continue;

        const { pos: { x, y } } = ray;
        const key = `${x},${y}`;
        if (!rayMap.has(key)) {
            rayMap.set(key, ray);
        }
    }
    console.log("😱>>>> ~ :", rayMap.keys())

    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            const key = `${x},${y}`;
            const ray = rayMap.get(key);
            if (ray) {
                const strRay = formatRay(ray);
                const isDot = m[y][x] == ".";
                isDot && fmt.printf("%s", strRay);

                const combinedFormat = orientation(ray.dir) == "horz" ? underline : strikethrough;
                !isDot && fmt.printf("%s", combinedFormat(m[y][x]));
            } else if ("/\\-|".includes(matrix[y][x])) {
                fmt.printf("%s", green(m[y][x]));
            } else {
                fmt.printf("%s", gray(m[y][x]));
            }
        }

        fmt.printf("\n");
    }
    fmt.printf("%s", white("\n"));
}

function formatRay(ray: Ray): string {
    const { x: dx, y: dy } = ray.dir;
    if (dx > 0) {
        return "→";
    } else if (dx < 0) {
        return "←";
    } else if (dy > 0) {
        return "↓";
    } else if (dy < 0) {
        return "↑";
    } else {
        return "X";
    }
}