// deno-lint-ignore-file prefer-const
import { green } from "https://deno.land/std@0.209.0/fmt/colors.ts";
import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";

export const sampleInput01 = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`;
type GraphType = { [key: string]: { [key: string]: number } };
class Graph {
    graph: GraphType;
    parent: { [key: string]: string | null };

    constructor(graph: GraphType) {
        this.graph = graph;
        this.parent = {};
        for (const n in this.graph) {
            this.parent[n] = null;
        }
    }

    bfs(start: string, target: string): boolean {
        this.parent = {};
        for (const n in this.graph) {
            this.parent[n] = null;
        }

        this.parent[start] = start;
        const queue: string[] = [start];

        while (queue.length > 0) {
            const current = queue.shift()!;
            for (const [e, c] of Object.entries(this.graph[current])) {
                if (c > 0 && this.parent[e] === null) {
                    this.parent[e] = current;
                    queue.push(e);
                }
            }
        }

        return this.parent[target] !== null;
    }

    minCut(source: string, sink: string): number {
        for (const v in this.graph) {
            for (const k in this.graph[v]) {
                this.graph[v][k] = 1;
            }
        }

        let maxFlow = 0;
        while (this.bfs(source, sink)) {
            let flow = Number.POSITIVE_INFINITY;
            let currNode = sink;

            while (currNode !== source) {
                const prevNode = this.parent[currNode]!;
                flow = Math.min(flow, this.graph[prevNode][currNode]);
                currNode = prevNode;
            }

            maxFlow += flow;

            currNode = sink;
            while (currNode !== source) {
                const u = this.parent[currNode]!;
                this.graph[u][currNode] -= flow;
                this.graph[currNode][u] += flow;
                currNode = u;
            }
        }

        return maxFlow;
    }

    solve(): number {
        const g1 = Object.values(this.parent).filter((p) => p !== null).length;
        return (Object.keys(this.graph).length - g1) * g1;
    }
}


if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const graph = parseInput(rawInput);
    console.log("🦊>>>> ~ :", graph)

    const G = new Graph(graph);
    const p1 = part1(G);
    console.log("🦊>>>> ~ p1:", p1)
}


function part1(G: Graph): number {

    const [s, ...other] = Object.keys(G.graph);

    for (const t of other) {
        if (G.minCut(s, t) === 3) {
            break;
        }
    }

    const res = G.solve();
    console.log("🦊>>>> ~ part1 ~ res:", res)
    return res;
}

function parseInput(input: string): GraphType {
    const graph: GraphType = {};
    const lines = input.trim().split("\n");
    for (const li of lines) {
        const [left, right] = li.split(": ");
        if (!graph[left]) graph[left] = {};
        for (const r of right.split(" ")) {
            graph[left][r] = 1;
            if (!graph[r]) graph[r] = {};
            graph[r][left] = 1;
        }
    };

    return graph;
}

