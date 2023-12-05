const { readFileSync } = require("fs");


export const sampleInput01 = `
    px{a<2006:qkq,m>2090:A,rfg}
    pv{a>1716:R,A}
    lnx{m>1548:A,A}
    rfg{s<537:gd,x>2440:R,A}
    qs{s>3448:A,lnx}
    qkq{x<1416:A,crn}
    crn{x>2662:A,R}
    in{s<1351:px,qqz}
    qqz{s>2770:qs,m<1801:hdj,R}
    gd{a>3333:R,R}
    hdj{m>838:A,pv}

    {x=787,m=2655,a=1222,s=2876}
    {x=1679,m=44,a=2067,s=496}
    {x=2036,m=264,a=79,s=2244}
    {x=2461,m=1339,a=466,s=291}
    {x=2127,m=1623,a=2188,s=1013}
`;

type Part = {
    x: number,
    m: number,
    a: number,
    s: number,
}

type PartToDestinationFunc = (part: Part) => string;
type Workflow = {
    label: string,
    condition: PartToDestinationFunc,
}

(function main() {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });
    const input = parseInput(sampleInput01);
    // const p1 = part1(input);
    // console.log("🦊>>>> ~ p1:", p1)
})();

function part1(input: string): number {


    const sum = 0;

    return sum;
}

export function parseInput(input: string): void {
    const [conditionsRaw, partsRaw] = input.trim().split("\n\n");
    // map over the lines of conditionsRaw
    const conditions = conditionsRaw.split("\n").slice(0, 1).map(line => {
        const lin = line.trim().split(/[{}]/).filter(Boolean);
        if (!lin) return null;

        const [name, conditions] = lin;
        console.log("🦄>>>> ~ conditions ~ name:", lin)
        const snippets = conditions.split(",").map(part => {
            const [predicateRaw, valueRaw] = part.split(":");
            let codeSnippet = `if (${predicateRaw}) { return "${valueRaw}"; }`;
            if (valueRaw === undefined) {
                codeSnippet = `return "${predicateRaw}"; `
            }
            return codeSnippet;
        });
        const func = eval(`
        function ${name}Step(x) {
            with(x) {
                ${snippets.join('\n')}
            }
        }`);
        return func;
    }).filter(Boolean);
    console.log("🦊>>>> ~ snippets ~ snippets:", conditions)

    // regex for parsing a part line
    const partRegex = /\{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)\}/;
    // apply to each line in partsRaw
    const parts = partsRaw.split("\n").map(line => {
        const match = partRegex.exec(line.trim());
        if (!match || !match.groups) {
            throw new Error("Could not parse part line: " + line);
        }
        const part: Part = {
            x: parseInt(match.groups.x),
            m: parseInt(match.groups.m),
            a: parseInt(match.groups.a),
            s: parseInt(match.groups.s),
        };
        return part;
    });
}