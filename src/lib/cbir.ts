import sharp from "sharp";
import type {
  Gray,
  RGB,
  HSV,
  ImageMatrix,
  ImageData,
  CBIRCalculationResult,
  GLCM,
} from "@/types/image";
import { getNormalizeMatrix, initMatrix } from "./matrix";
import {
  getMeanFromArr,
  getStandardDeviationFromArr,
  getWeightedMeanFromArr,
} from "./statistics";

/* Function to Solve CBIR */
export const solveCBIR = async (
  imageQuery: Buffer,
  imageDataSet: Buffer[],
  isTexture: boolean
) => {
  if (isTexture) {
    return await solveCBIRTexture(imageQuery, imageDataSet);
  } else {
    return await solveCBIRColor(imageQuery, imageDataSet);
  }
};

/* Function to Solve CBIR by Texture wise */
export const solveCBIRTexture = async (
  imageQuery: Buffer,
  imageDataSet: Buffer[]
): Promise<CBIRCalculationResult> => {
  // Convert to co-occurance Matrix
  const inputImageGrayData = await convertBufferGrayMatrix(imageQuery);

  // Get normalized GLCM
  const inputImageNormalizedGLCM = getNormalizedGLCM(inputImageGrayData);

  // Get input image texture vector
  const inputImageFeatureVector = getImageTextureFeatureVector(
    inputImageNormalizedGLCM
  );

  // Compare to dataset
  const compareResult = await Promise.all(
    imageDataSet.map(async (image, index) => {
      // Convert to gray matrix
      const dataSetImageData = await convertBufferGrayMatrix(image);

      // Get normalized glcm
      const dataSetImageFeatureVector = getNormalizedGLCM(dataSetImageData);

      // Get feature vector
      const dataSetFeatureVector = getImageTextureFeatureVector(
        dataSetImageFeatureVector
      );

      // Check similarity
      const similarity = getSimiliarity(
        inputImageFeatureVector,
        dataSetFeatureVector
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

/* Function to Solve CBIR by Color wise */
export const solveCBIRColor = async (
  imageQuery: Buffer,
  imageDataSet: Buffer[]
): Promise<CBIRCalculationResult> => {
  // Convert input image (file) to hsv
  const inputImageData = await convertBufferToHSVMatrix(imageQuery);

  // Get feature vector
  const inputImage16FeatureVector = getColor16FeatureVector(inputImageData);

  // Get weighted block
  // Blok 6, 7, 10, 11 memiliki bobot 2
  // Blok lainnya memiliki bobot 1
  // prettier-ignore
  const weightedBlock = [
    1, 1, 1, 1,
    1, 2, 2, 1,
    1, 2, 2, 1,
    1, 1, 1, 1
  ];

  // Compare to dataset
  const compareResult = await Promise.all(
    imageDataSet.map(async (image, index) => {
      // Convert to hsv
      const dataSetImageData = await convertBufferToHSVMatrix(image);

      // Get feature vector
      const dataSetImage16FeatureVector =
        getColor16FeatureVector(dataSetImageData);

      // Get similarity each block
      const blockSimilarities: number[] = [];

      for (let i = 0; i < 16; i++) {
        const similarity = getSimiliarity(
          inputImage16FeatureVector[i],
          dataSetImage16FeatureVector[i]
        );

        blockSimilarities.push(similarity);
      }

      // Get weighted average
      // Blok 6, 7, 10, 11 memiliki bobot 2
      // Blok lainnya memiliki bobot 1
      const meanSimilarity = getWeightedMeanFromArr(
        blockSimilarities,
        weightedBlock
      );
      // To reduce load in data transmission, only return the index in the original dataset array.
      return {
        index,
        similarity: meanSimilarity,
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

/* Function to get Feature Vector For Color (Array of 16x72 matrix) */
export const getColor16FeatureVector = (
  imageDataHSV: ImageData<HSV>
): number[][] => {
  // Bagi image menjadi 4x4 blok
  // Setiap blok memiliki 8x3x3 bin
  // Inisialisasi array untuk menyimpan 16 feature vector (1 untuk setiap blok)
  const featureVectors16 = initMatrix(16, 72);

  for (let i = 0; i < imageDataHSV.height; i++) {
    for (let j = 0; j < imageDataHSV.width; j++) {
      const [h, s, v] = imageDataHSV.matrix[i][j];

      // Get block index
      const blockI = Math.floor((4 * i) / imageDataHSV.height);
      const blockJ = Math.floor((4 * j) / imageDataHSV.width);
      const blockIndex = blockI * 4 + blockJ;

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

      // Increment feature vector
      const binIndex = hIndex * 9 + sIndex * 3 + vIndex;
      featureVectors16[blockIndex][binIndex] += 1;
    }
  }

  return featureVectors16;
};

/* Function to get Feature Vector For Texture */
export const getImageTextureFeatureVector = (
  normalizedGLCM: GLCM
): number[] => {
  let contrast = 0;
  let homogeneity = 0;
  let entropy = 0;
  let ASM = 0;

  // Get feature vector
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < 256; j++) {
      // Contrast
      contrast += normalizedGLCM[i][j] * (i - j) * (i - j);

      // Homogeneity
      homogeneity += normalizedGLCM[i][j] / (1 + (i - j) * (i - j));

      // ASM
      ASM += Math.pow(normalizedGLCM[i][j], 2);

      // Logarithm only valid when > 0
      if (normalizedGLCM[i][j] > 0) {
        entropy -= normalizedGLCM[i][j] * Math.log10(normalizedGLCM[i][j]);
      }
    }
  }

  // energy
  const energy = Math.sqrt(ASM);

  // feature vector
  const featureVector: number[] = [contrast, homogeneity, entropy, energy];

  // Get gaussian normalization
  const mean = getMeanFromArr(featureVector);
  const standardDeviation = getStandardDeviationFromArr(featureVector);
  const gaussianNormalization = featureVector.map((value) => {
    return (value - mean) / standardDeviation;
  });

  return gaussianNormalization;
};

/* Function to get Similarity (using cosine dot product) */
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

/* Function to get Normalized GLCM */
export const getNormalizedGLCM = (grayImageData: ImageData<Gray>): GLCM => {
  // Initialize symmetric glcm
  const symetricGLCM = initMatrix(256, 256);

  // Get symmetric glcm
  for (let i = 0; i < grayImageData.height; i++) {
    for (let j = 0; j < grayImageData.width; j++) {
      if (j != 0) {
        const firstGrayElement = grayImageData.matrix[i][j - 1];
        const secondGrayElement = grayImageData.matrix[i][j];

        symetricGLCM[firstGrayElement][secondGrayElement] += 1;
        symetricGLCM[secondGrayElement][firstGrayElement] += 1;
      }
    }
  }

  // Normalize glcm
  const normalizedGLCM = getNormalizeMatrix(symetricGLCM);

  return normalizedGLCM;
};

/* FILE & BUFFER CONVERSION */
export const convertFileToBuffer = async (file: File): Promise<Buffer> => {
  const blob = new Blob([file]);
  const arrBuff = await blob.arrayBuffer();
  const buffer = Buffer.from(arrBuff);

  return buffer;
};

export const convertBufferGrayMatrix = async (
  buffer: Buffer
): Promise<ImageData<Gray>> => {
  // Convert file to raw image data
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelArray = new Uint8ClampedArray(data.buffer);

  const channels = info.channels;
  const width = info.width;
  const height = info.height;

  // Get Gray matrix
  const grayMatrix: ImageMatrix<Gray> = [];

  for (let i = 0; i < height; i++) {
    const row: Gray[] = [];
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * channels;

      const r = pixelArray[index];
      const g = pixelArray[index + 1];
      const b = pixelArray[index + 2];

      const rgbPixel: RGB = [r, g, b];
      const grayPixel: Gray = convertRGBtoGray(rgbPixel);

      row.push(grayPixel);
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

export const convertBufferToRGBMatrix = async (
  buffer: Buffer
): Promise<ImageData<RGB>> => {
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

export const convertBufferToHSVMatrix = async (
  buffer: Buffer
): Promise<ImageData<HSV>> => {
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

/* COLOR CONVERSION */
export const convertRGBtoGray = (rgb: RGB): Gray => {
  const [r, g, b] = rgb;

  return Math.round(0.29 * r + 0.587 * g + 0.114 * b);
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
