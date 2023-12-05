import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { part01, sampleInput01 } from "./main.ts";

Deno.test(function sampleInputTest() {
  const input = sampleInput01;
  const [p1, p2] = part01(input);
  assertEquals(p1, 35);
  assertEquals(p2, 46);
});
