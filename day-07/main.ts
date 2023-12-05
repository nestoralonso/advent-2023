import { readFileSync } from "node:fs";

export const sampleInput01 = [
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483",
];

const CardScore: { [key: string]: number } = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14,
};

const CardScoreWithJoker: { [key: string]: number } = {
    "J": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "Q": 11,
    "K": 12,
    "A": 13,
};

const HandType = {
    HighCard: 1,
    OnePair: 2,
    TwoPair: 3,
    ThreeOfAKind: 4,
    FullHouse: 5,
    FourOfAKind: 6,
    FiveOfAKind: 7,
}
const handTypeNames = [
    undefined,
    "HighCard",
    "OnePair",
    "TwoPair",
    "ThreeOfAKind",
    "FullHouse",
    "FourOfAKind",
    "FiveOfAKind",
];

function handType(hand: string, tranformJokers = false): number {
    const cards = hand.split("");
    let groupedCards = Object.groupBy(cards, (c) => c);
    let cardCounts = Object.values(groupedCards).map(c => c.length).toSorted((a, b) => b - a);

    const numJokers = groupedCards?.["J"]?.length ?? 0;
    if (tranformJokers && numJokers !== 5 && cards.includes("J")) {
        const maxEntry = Object.entries(groupedCards)
            .filter(([k, _vals]) => k !== "J")
            .toSorted((a, b) => b[1].length - a[1].length)[0];

        if (!Array.isArray(maxEntry)) {
            console.log("🦊>>>> ~ handType ~ cards:", cards)
            console.log("ERROR: maxEntry is not an array", maxEntry);
        }

        const [topCard] = maxEntry;
        groupedCards = Object.groupBy(cards.map(c => c === "J" ? topCard : c), (c) => c);
        cardCounts = Object.values(groupedCards).map(c => c.length).toSorted((a, b) => b - a);
    }

    const [highest, secondHighest] = cardCounts;

    if (highest === 5) {
        return HandType.FiveOfAKind;
    } else if (highest === 4) {
        return HandType.FourOfAKind;
    } else if (highest === 3 && secondHighest === 2) {
        return HandType.FullHouse;
    } else if (highest === 3) {
        return HandType.ThreeOfAKind;
    } else if (highest === 2 && secondHighest === 2) {
        return HandType.TwoPair;
    } else if (highest === 2) {
        return HandType.OnePair;
    } else {
        return HandType.HighCard;
    }
}

export function compareSimilarHand(hand1: string, hand2: string, tranformJokers = false): number {
    const Scorer = tranformJokers? CardScoreWithJoker : CardScore;
    for (let i = 0; i < hand1.length; i++) {
        const a = hand1[i];
        const b = hand2[i];

        if (Scorer[a] > Scorer[b]) {
            return 1;
        } else if (Scorer[a] < Scorer[b]) {
            return -1;
        }
    }

    return 0;
}

export function part01_and_02(lines: string[]) {
    const pairs: any[] = lines.map(li => {
        const [hand, bidStr] = li.split(" ");

        return [hand, parseInt(bidStr)];
    });

    const sortedPairs = sortPairs(pairs);

    let total = 0;
    for (const [i, [hand, bid]] of sortedPairs.entries()) {
        // console.log(i + 1, "👽", hand, bid, "=", handTypeNames[(handType(hand))], handType(hand));
        const score = (i + 1) * bid;

        total += score;
    }

    const sortedPairs2 = sortPairs(pairs, true);
    let totalPart2 = 0;
    for (const [i, [hand, bid]] of sortedPairs2.entries()) {
        console.log(i + 1, "👽", hand, bid, "=", handTypeNames[(handType(hand))], handType(hand));
        const score = (i + 1) * bid;

        totalPart2 += score;
    }

    return [total, totalPart2];
}

if (import.meta.main) {
    const input = readFileSync("./input.txt", { encoding: "utf8" }).split("\n").filter(Boolean);
    const [p1, p2] = part01_and_02(input);

    console.log("part1=", p1);
    console.log("part2=", p2);
}

function sortPairs(pairs: any[], tranformJokers = false): any[] {
    return pairs.toSorted(([hand1], [hand2]) => {
        const type1 = handType(hand1, tranformJokers);
        const type2 = handType(hand2, tranformJokers);

        if (type1 !== type2) {
            return type1 - type2;
        }

        return compareSimilarHand(hand1, hand2, tranformJokers);
    });
}
