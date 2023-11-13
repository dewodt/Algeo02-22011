// Get mean of array
export const getMeanFromArr = (arr: number[]): number => {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);

  return sum / arr.length;
};

// Get standard deviation of array
export const getStandardDeviationFromArr = (arr: number[]): number => {
  const mean = getMeanFromArr(arr);

  const variance = arr.reduce((acc, curr) => {
    return acc + Math.pow(curr - mean, 2);
  }, 0);

  return Math.sqrt(variance / arr.length);
};

// Get weighted mean of array
export const getWeightedMeanFromArr = (
  arr: number[],
  weights: number[]
): number => {
  const sumWiXi = arr.reduce((acc, curr, i) => acc + curr * weights[i], 0);
  const sumWi = weights.reduce((acc, curr) => acc + curr, 0);

  return sumWiXi / sumWi;
};
