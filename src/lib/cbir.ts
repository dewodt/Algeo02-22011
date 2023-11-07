import sharp from "sharp";
import type { RGB, HSV, ImageMatrix, ImageData } from "@/types/image";

export const convertFileToRGBMatrix = async (
  file: File
): Promise<ImageData<RGB>> => {
  // Convert from file to buffer
  const blob = new Blob([file]);
  const arrBuff = await blob.arrayBuffer();
  const buffer = Buffer.from(arrBuff);

  // Convert file to raw image data
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelArray = new Uint8ClampedArray(data.buffer);

  const channels = info.channels;
  const width = info.width;
  const height = info.height;

  // Get RGB matrix
  const rgbMatrix: ImageMatrix<RGB> = [];

  for (let i = 0; i < height; i++) {
    const row: RGB[] = [];
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * channels;

      const r = pixelArray[index];
      const g = pixelArray[index + 1];
      const b = pixelArray[index + 2];

      const pixel: RGB = [r, g, b];

      row.push(pixel);
    }
    rgbMatrix.push(row);
  }

  const imageData: ImageData<RGB> = {
    width,
    height,
    matrix: rgbMatrix,
  };

  return imageData;
};
