import { ImageResults } from "./image";

export type LastValidSearch = {
  imageInputSrc: string;
  imageResults: ImageResults;
  timeTaken: number;
  isTexture: boolean;
  scrapeUrl?: string;
};

export type LastValidSearchState = LastValidSearch | undefined;
