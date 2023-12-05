type Matrix = number[][];

function floodFill(matrix: Matrix, row: number, col: number): void {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Check if the current cell is within bounds and contains a zero
  if (row < 0 || row >= rows || col < 0 || col >= cols || matrix[row][col] !== 0) {
    return;
  }

  // Fill the current cell
  matrix[row][col] = 1;

  // Recursively fill neighboring cells
  floodFill(matrix, row - 1, col); // Up
  floodFill(matrix, row + 1, col); // Down
  floodFill(matrix, row, col - 1); // Left
  floodFill(matrix, row, col + 1); // Right
}

// Example usage
const matrix: Matrix = [
  [0, 7, 0, 7],
  [0, 0, 7, 0],
  [7, 0, 0, 7],
  [0, 7, 0, 0],
];

for (const row of matrix) {
  console.log(row);
}

// Call floodFill with the starting point (e.g., top-left corner)
floodFill(matrix, 0, 0);

console.log("🦊>>>> ~ const:")
// Display the modified matrix
for (const row of matrix) {
  console.log(row);
}