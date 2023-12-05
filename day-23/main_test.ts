import { Particle, Vec2, diff, dot, findIntersection, getPos, inThePast, particleToSlopeIntercept, vec3 } from "./main.ts";



function inter(p0: Particle, p1: Particle): Vec2 | null {
    const line0 = particleToSlopeIntercept(p0);
    const line1 = particleToSlopeIntercept(p1);

    if (line0 === null || line1 === null) return null;

    const res = findIntersection(line0, line1);

    return res;
}

Deno.test(function crossedInPast() {
    // const p0: Particle = { pos: { x: 19, y: 13, z: 30 }, vel: { x: -2, y: 1, z: -2 } };
    // const p1: Particle = { pos: { x: 20, y: 19, z: 15 }, vel: { x: 1, y: -5, z: -3 } };


    const p0: Particle = { pos: vec3(20, 25, 34), vel: vec3(-2, -2, -4) };
    const p1: Particle = { pos: vec3(20, 19, 15), vel: vec3(1, -5, -3) };

    const intersect: Vec2 | null = inter(p0, p1);
    if (!intersect) return;

    console.log("🦊>>>> ~~ intersect:", intersect)

    let res = inThePast(p0, intersect);
    console.log("🦊>>>> ~~ res:", res)

    res = inThePast(p1, intersect);
    console.log("🦊>>>> ~~ res:", res)


    for (let t = -4; t < 12; t++) {
        const p = getPos(p0, t);
        console.log(`${t},${p.x},${p.y}`);
    }
});

