// Original image data already available in client when uploaded, so no need to transmit image data from the server again.
// Only send indexes of the initial sorting (before sorted) and similarity of the image with the compared image
export type SuccessSearchByUploadResponse = {
  index: number;
  similarity: number;
}[];

// Data set is not available in client when scraped, so need to transmit image data from the server.
// Don't send image url links scrape, because of CORS. So send base 64 image instead. Also send similarity with the compared image.
export type SuccessSearchByScrapeResponse = {
  imageSrc: string;
  similarity: number;
}[];

export interface ErrorResponse {
  error: string;
  message: string;
}
