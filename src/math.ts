export const dotProduct = (a: number[], b: number[]): number => {
  let total = 0;
  for (let i = 0; i < a.length && i < b.length; ++i) {
    total += a[i] * b[i];
  }
  return total;
};

export const createVector = <T>(
  length: number,
  createValue: (i: number) => T
) => Array.from({ length }, (_, i) => createValue(i));

export const createMatrix = <T>(
  rowCount: number,
  columnCount: number,
  createValue: (i: number, j: number) => T
): T[][] =>
  createVector(rowCount, (i) =>
    createVector(columnCount, (j) => createValue(i, j))
  );

export const matrixProduct = (a: number[][], b: number[][]): number[][] => {
  if (a[0].length !== b.length) {
    throw new Error(
      `Cannot take product of ${a[0].length} column matrix by ${b.length} row matrix.`
    );
  }
  return createMatrix(a.length, b[0].length, (i, j) => {
    let total = 0;
    for (let x = 0; x < b.length; ++x) {
      total += a[i][x] * b[x][j];
    }
    return total;
  });
};
