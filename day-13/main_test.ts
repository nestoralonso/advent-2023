import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { dist, parseLines, expandMap, sampleInput01, findGalaxies } from "./main.ts";


Deno.test(function strongerTest() {
    const expanded = expandMap(parseLines(sampleInput01));
    console.log("🐸>: expanded")

    const galaxies = findGalaxies(expanded);
    //@ts-ignore
    assertEquals(9, dist(galaxies.get("5"), galaxies.get("9")));
    //@ts-ignore
    assertEquals(15, dist(galaxies.get("1"), galaxies.get("7")));
    //@ts-ignore
    assertEquals(17, dist(galaxies.get("3"), galaxies.get("6")));

    //@ts-ignore
    assertEquals(5, dist(galaxies.get("8"), galaxies.get("9")));
}
);