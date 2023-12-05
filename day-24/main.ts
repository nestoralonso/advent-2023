import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";


export const sampleInput01 = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;

const MIN = 200000000000000;
const MAX = 400000000000000;
// const MIN = 7;
// const MAX = 27;

export type Vec3 = { x: number; y: number; z: number };
export type Vec2 = { x: number; y: number };
export type Particle = {
    pos: Vec3;
    vel: Vec3;
};

export function vec3(x: number, y: number, z: number): Vec3 {
    return { x, y, z };
}
if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const particles = parseInput(rawInput);
    const p1 = part1(particles);
    console.log("🦊>>>> ~ p1:", p1)
}

function parseInput(input: string): Particle[] {
    const lines = input.trim().split("\n");
    const particles: Particle[] = lines.map((line) => {
        const [p, v] = line.trim().split("@");
        const [pos, vel] = [p.split(","), v.split(",")];
        return {
            pos: { x: parseInt(pos[0]), y: parseInt(pos[1]), z: parseInt(pos[2]) },
            vel: { x: parseInt(vel[0]), y: parseInt(vel[1]), z: parseInt(vel[2]) },
        };
    });

    return particles;
}

export function getPos(p: Particle, t: number): Vec2 {
    const res = {
        x: p.pos.x + p.vel.x * t,
        y: p.pos.y + p.vel.y * t,
    };

    return res;
}

export function add(v0: Vec2, v1: Vec2): Vec2 {
    const res = {
        x: v0.x + v1.x,
        y: v0.y + v1.y,
    };

    return res;
}

export function diff(v0: Vec2, v1: Vec2): Vec2 {
    const res = {
        x: v0.x - v1.x,
        y: v0.y - v1.y,
    };

    return res;
}

export function dot(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y;
}

function part1(particles: Particle[]): number {

    let sum = 0;
    for (const [p0, p1] of generateCombinations(particles)) {

        const line0 = particleToSlopeIntercept(p0);
        const line1 = particleToSlopeIntercept(p1);

        if (line0 !== null && line1 !== null) {
            const inter = findIntersection(line0, line1);
            if (!inter) continue;

            const past = inThePast(p0, inter) || inThePast(p1, inter);
            if (past) {
                continue;
            }

            if (inter.x >= MIN && inter.x <= MAX && inter.y >= MIN && inter.y <= MAX) {
                sum += 1;
            }
        }
    }

    return sum;
}


export function particleToSlopeIntercept(
    particle: Particle
): SlopeIntercept | null {


    const { x: x0, y: y0 } = particle.pos;
    const { x: vx, y: vy } = particle.vel;

    // Handle vertical lines (infinite slope)
    if (vx === 0) {
        return null; // Indicate vertical line with null values
    }

    // Calculate the slope (m)
    const m = vy / vx;

    // Calculate the y-intercept (b)
    const b = y0 - m * x0;

    return { m, b };
}

type SlopeIntercept = { m: number; b: number };

export function findIntersection(li0: SlopeIntercept, li1: SlopeIntercept): { x: number; y: number } | null {
    // Check if lines are parallel
    if (li0.m === li1.m) {
        return null; // No intersection for parallel lines
    }

    // Calculate intersection point
    const x = (li1.b - li0.b) / (li0.m - li1.m);
    const y = li0.m * x + li0.b;

    return { x, y };
}

function* generateCombinations(particles: Particle[]): Generator<[Particle, Particle]> {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            yield [particles[i], particles[j]];
        }
    }
}

export function inThePast(p: Particle, intersect: Vec2, epsilon = 1): boolean {
    const d1 = dist(p.pos, intersect);
    const d2 = dist(getPos(p, epsilon), intersect);

    const res = d1 - d2;

    return (res < 0);
}

function dist(point1: Vec2, point2: Vec2): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    return Math.sqrt(dx * dx + dy * dy);
}
