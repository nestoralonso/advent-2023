import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { compareSimilarHand } from "./main.ts";


Deno.test(function strongerTest() {
  const hand1 = "33332";
  const hand2 = "2AAAA";

  const stronger = compareSimilarHand(hand1, hand2);
  assertEquals(stronger, -1);
});