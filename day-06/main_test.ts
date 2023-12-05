import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { part01_and_02, sampleInput01 } from "./main.ts";

Deno.test(function sampleInputTest() {
  const input = sampleInput01;
  const [p1, p2] = part01_and_02(input);
  assertEquals(p1, 13);
  assertEquals(p2, 30);
});
