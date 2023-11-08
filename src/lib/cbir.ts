import sharp from "sharp";
import type { Gray, RGB, HSV, ImageMatrix, ImageData } from "@/types/image";

export const solveCBIRColor = async (
  imageQuery: File,
  imageDataSet: File[]
) => {
  // Convert to hsv
  const inputImageData = await convertFileToHSVMatrix(imageQuery);

  // Get feature vector
  const inputImageFeatureVector =
    getImageHSVGlobalHistogramFeatureVector(inputImageData);

  // Compare to dataset
  const compareResult = await Promise.all(
    imageDataSet.map(async (image, index) => {
      // Convert to hsv
      const dataSetImageData = await convertFileToHSVMatrix(image);
      // Get feature vector
      const dataSetImageFeatureVector =
        getImageHSVGlobalHistogramFeatureVector(dataSetImageData);

      // Check similarity
      const similarity = getSimiliarity(
        inputImageFeatureVector,
        dataSetImageFeatureVector
      );

      // To reduce load in data transmission, only return the index in the original dataset array.
      return {
        index,
        similarity,
      };
    })
  );

  // Filter out similarity
  const filteredCompareResult = compareResult.filter(
    (result) => result.similarity > 0.6
  );

  // Sort by similarity
  filteredCompareResult.sort((a, b) => b.similarity - a.similarity);

  return filteredCompareResult;
};

export const getImageHSVGlobalHistogramFeatureVector = (
  queryImageHSV: ImageData<HSV>
): number[] => {
  // Inisialisasi feature vector dengan panjang 8x3x3 = 72
  const queryFeatureVector = new Array(72).fill(0);
  for (let i = 0; i < queryImageHSV.height; i++) {
    for (let j = 0; j < queryImageHSV.width; j++) {
      const [h, s, v] = queryImageHSV.matrix[i][j];
      // H
      // 0 => 316, 360
      // 1 => 1, 25
      // 2 => 26, 40
      // 3 => 41, 120
      // 4 => 121, 190
      // 5 => 191, 270
      // 6 => 271, 295
      // 7 => 295, 315
      // Hue 0 = Hue 360 (Circular)
      let hIndex;
      if ((h > 316.5 && h <= 360) || h == 0) {
        hIndex = 0;
      } else if (h > 0 && h <= 25.5) {
        hIndex = 1;
      } else if (h > 25.5 && h <= 40.5) {
        hIndex = 2;
      } else if (h > 40.5 && h <= 120.5) {
        hIndex = 3;
      } else if (h > 120.5 && h <= 190.5) {
        hIndex = 4;
      } else if (h > 190.5 && h <= 270.5) {
        hIndex = 5;
      } else if (h > 270.5 && h <= 295.5) {
        hIndex = 6;
      } else {
        hIndex = 7;
      }

      // S
      // 0 => [0, 0.2)
      // 1 => [0.2, 0.7)
      // 2 => [0.7, 1]
      let sIndex;
      if (s >= 0 && s < 0.2) {
        sIndex = 0;
      } else if (s >= 0.2 && s < 0.7) {
        sIndex = 1;
      } else {
        sIndex = 2;
      }

      // V
      // 0 => [0, 0.2)
      // 1 => [0.2, 0.7)
      // 2 => [0.7, 1]
      let vIndex;
      if (v >= 0 && v < 0.2) {
        vIndex = 0;
      } else if (v >= 0.2 && v < 0.7) {
        vIndex = 1;
      } else {
        vIndex = 2;
      }

      queryFeatureVector[hIndex * 9 + sIndex * 3 + vIndex] += 1;
    }
  }

  return queryFeatureVector;
};

export const getSimiliarity = (A: number[], B: number[]): number => {
  // Precondition: A.length === B.length
  const n = A.length;

  let sumAB = 0;
  let sumA2 = 0;
  let sumB2 = 0;

  for (let i = 0; i < n; i++) {
    sumAB += A[i] * B[i];
    sumA2 += A[i] * A[i];
    sumB2 += B[i] * B[i];
  }

  const sim = sumAB / (Math.sqrt(sumA2) * Math.sqrt(sumB2));

  return sim;
};

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

export const convertFileToGrayMatrix = async (
  file: File
): Promise<ImageData<Gray>> => {
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
  const grayMatrix: ImageMatrix<Gray> = [];

  for (let i = 0; i < height; i++) {
    const row: Gray[] = [];
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * channels;

      const r = pixelArray[index];
      const g = pixelArray[index + 1];
      const b = pixelArray[index + 2];

      const pixel: number = Math.round(0.29*r + 0.587*g + 0.114*b);

      row.push(pixel);
    }
    grayMatrix.push(row);
  }

  const imageData: ImageData<Gray> = {
    width,
    height,
    matrix: grayMatrix,
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
