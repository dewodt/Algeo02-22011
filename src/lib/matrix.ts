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
