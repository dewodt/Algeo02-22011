export type RGB = [number, number, number];

export type HSV = [number, number, number];

export type Gray = number;

export type ImageMatrix<T> = T[][];

export type GLCMatrix = number[][];

export interface ImageData<T> {
  width: number;
  height: number;
  matrix: ImageMatrix<T>;
}

// State contains src result image to be displayed and the similarity
export type ImageResults = {
  imageSrc: string;
  similarity: number;
}[];
export type ImageResultsState = ImageResults | undefined;

// Returns index of initial dataset input/scraped and similiarity after compared with query
export type CBIRCalculationResult = {
  index: number;
  similarity: number;
}[];
