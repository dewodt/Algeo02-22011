export interface ImageResult {
  image: File;
  similarity: number;
}

export type RGB = [number, number, number];

export type HSV = [number, number, number];

export type ImageMatrix<T> = T[][];

export interface ImageData<T> {
  width: number;
  height: number;
  matrix: ImageMatrix<T>;
}
