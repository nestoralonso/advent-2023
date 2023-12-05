function* interval(ini: number, length: number): Generator<number> {
  for (let i = 0; i < length; i++) {
    yield ini + i;
  }
}

// Example usage:
const iniValue = 5;
const intervalLength = 3;
const intervalGenerator = interval(iniValue, intervalLength);

for (const value of intervalGenerator) {
  console.log(value);
}