export type RGB = [number, number, number];

export type HSV = [number, number, number];

export type ImageMatrix<T> = T[][];

export interface ImageData<T> {
  width: number;
  height: number;
  matrix: ImageMatrix<T>;
}

// State contains the image file uploaded and the similarity with the compared image
export type SearchByUploadImageResults = {
  image: File;
  similarity: number;
}[];
export type SearchByUploadImageResultsState =
  | SearchByUploadImageResults
  | undefined;

// State contains scraped image base64 and the similarity with the compared image
export type SearchByScrapeImageResults = {
  imageBase64: string;
  contentType: string;
  similarity: number;
}[];
export type SearchByScrapeImageResultsState =
  | SearchByScrapeImageResults
  | undefined;

// Returns index of initial dataset input/scraped and similiarity after compared with query
export type CBIRCalculationResult = {
  index: number;
  similarity: number;
}[];
