import { parseLine } from "./main.ts";


Deno.test(function strongerTest() {
    const lineParsed = parseLine("U 2 (#7a21e3)");
    console.log("🦊>>>> ~ strongerTest ~ lineParsed:", lineParsed)
});