// Intialize matrix with 0
// WARNING: DON'T USE Array.fill(Array.fill()) because it will copy the reference of the array
// Editing matrix will change all the row
export const initMatrix = (row: number, col: number): number[][] => {
  const matrix: number[][] = [...Array(row)].map((_) => Array(col).fill(0));

  return matrix;
};

// Get sum element of matrix
export const getSumElementMatrix = (matrix: number[][]): number => {
  let count = 0;

  // Sum matrix
  matrix.forEach((row) => {
    row.forEach((col) => {
      count += col;
    });
  });

  return count;
};

// Normalize matrix
export const getNormalizeMatrix = (matrix: number[][]): number[][] => {
  // Get total element
  const total = getSumElementMatrix(matrix);

  // Normalize matrix
  const normalizeMatrix = matrix.map((row) => {
    return row.map((col) => {
      return col / total;
    });
  });

  return normalizeMatrix;
};
