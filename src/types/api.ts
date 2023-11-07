export type SearchByUploadDataSetResponse = {
  index: number;
  similarity: number;
}[];

export interface ErrorResponse {
  error: string;
  message: string;
}
