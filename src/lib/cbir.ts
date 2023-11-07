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

export const convertFileToHSVMatrix = async (
  file: File
): Promise<ImageData<HSV>> => {
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

  // Get HSV matrix (first from RGB, then convert each RGB to HSV)
  const hsvMatrix: ImageMatrix<HSV> = [];

  for (let i = 0; i < height; i++) {
    const row: HSV[] = [];
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * channels;

      const r = pixelArray[index];
      const g = pixelArray[index + 1];
      const b = pixelArray[index + 2];

      const pixel: HSV = convertRGBToHSV([r, g, b]);

      row.push(pixel);
    }
    hsvMatrix.push(row);
  }

  const imageData: ImageData<HSV> = {
    width,
    height,
    matrix: hsvMatrix,
  };

  return imageData;
};

export const convertRGBToHSV = (rgb: RGB): HSV => {
  const [r, g, b] = rgb;

  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const cMax = Math.max(rPrime, gPrime, bPrime);
  const cMin = Math.min(rPrime, gPrime, bPrime);
  const delta = cMax - cMin;

  let h: number;
  if (delta === 0) {
    h = 0;
  } else if (cMax === rPrime) {
    h = 60 * (((gPrime - bPrime) / delta) % 6);
  } else if (cMax === gPrime) {
    h = 60 * ((bPrime - rPrime) / delta + 2);
  } else {
    h = 60 * ((rPrime - gPrime) / delta + 4);
  }

  let s: number;
  if (cMax === 0) {
    s = 0;
  } else {
    s = delta / cMax;
  }

  let v = cMax;

  return [h, s, v];
};
