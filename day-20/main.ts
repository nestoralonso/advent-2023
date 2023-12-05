import { printf } from "https://deno.land/std@0.209.0/fmt/printf.ts";
import { readFileSync } from "node:fs";


export const sampleInput01 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`;

export const sampleInput02 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`;

type Pulse = "low" | "high";
type Type = "%" | "&" | "broadcaster";
interface Module {
    name: string;
    type: Type;
    state: "on" | "off" | null; // for flip-flops
    memory: Map<string, Pulse>;
    dest: string[];
}

type Input = {
    name: string,
    last: Pulse,
}

type ModuleMap = { [key: string]: Module };

if (import.meta.main) {
    const rawInput = readFileSync("./input.txt", { encoding: "utf8" });

    const modules = parseInput(rawInput);
    const p1 = part1(modules);
    console.log("🦊>>>> ~ p1:", p1)
}

function part1(moduls: ModuleMap): number {
    const curr = "broadcaster"
    return process(moduls, curr);
}

type Step = {
    origin: string,
    target: string,
    pulse: Pulse,
};
function process(modules: ModuleMap, current: string): number {
    const queue: Step[] = [];

    let lows = 0;
    let highs = 0;
    for (let i = 0; i < 1000; i++) {
        queue.push({ target: current, pulse: "low", origin: "button" });
        let j = -1;
        while (queue?.length) {
            const item = queue.shift()!;
            const { origin, target, pulse } = item;

            if (pulse === "low") {
                lows++;
            } else {
                highs++;
            }

            // console.log(j, "👀", JSON.stringify({ highs, lows }))
            const modul = modules[target];
            if (!modul) continue;

            const { type } = modul;
            let res: Pulse = "low";
            if (type === "broadcaster") {
                res = pulse;
                const next: Step[] = modul.dest.map(dst => ({ origin: modul.name, target: dst, pulse: res }));
                queue.push(...next);
            } else if (type === "%") {
                if (pulse === "low") {
                    modul.state = modul.state === "off" ? "on" : "off";
                    res = modul.state == "on" ? "high" : "low";
                    // console.log("🐙", res);

                    const next: Step[] = modul.dest.map(dst => ({ origin: modul.name, target: dst, pulse: res }));
                    queue.push(...next);
                }
            } else if (type === "&") {
                modul.memory.set(origin, pulse);

                const isHigh = [...modul.memory.values()].every((p) => p === "high");
                res = isHigh ? "low" : "high";

                // console.log("🐮", res);

                const next: Step[] = modul.dest.map(dst => ({ origin: modul.name, target: dst, pulse: res }));
                queue.push(...next);
            }

            // const f = (p: Pulse) => p === "high" ? "hi" : "lo";
            // console.log(`${origin} -${f(pulse)}- →  ${target} (${f(res)})`);
            j++;
        }
    }
    return lows * highs;
}

function parseInput(input: string): ModuleMap {
    const lines = input.split("\n").filter(l => l.trim());
    const inputMap = new Map<string, Input[]>;

    const modules: ModuleMap = {};
    for (const li of lines) {
        const [moduleInfoRaw, destRaw] = li.split("->");
        let [type, ...nameStr] = moduleInfoRaw;
        let name = "";
        const dest = destRaw.split(/,/).map(d => d.trim());
        if (!["%", "&"].includes(type)) {
            name = (type = "broadcaster");
        } else {
            name = nameStr.join("").trim();
        }

        for (const d of dest) {
            let entries = inputMap.get(d);
            if (!entries) {
                entries = [];
                inputMap.set(d, entries);
            }
            entries.push({ name, last: "low" });
        }

        const module: Module = {
            type: type as Type,
            name,
            dest,
            state: "off",
            memory: new Map(),
        };

        modules[name] = module;
    }

    for (const [name, module] of Object.entries(modules)) {
        for (const dst of module.dest) {
            if (dst in modules && modules[dst].type == "&") {
                modules[dst].memory.set(name, "low");
            }
        }
    }
    return modules;

}