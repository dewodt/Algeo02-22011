// @ts-expect-error
import Jimp from "jimp/es";
import { RGBMatrix } from "@/types/matrix";
import { RGB } from "@/types/image";

export const solveCBIRWithUploadDataSet = async (
  imageQuery: File,
  isTexture: boolean,
  imageDataSet: FileList
) => {
  console.log(imageQuery);
  console.log(imageDataSet);
  if (isTexture) {
    // Handle color method query
  } else {
    // Handle texture method query
    console.log("TES");
    const test = await convertFileToRGBMatrix(imageQuery);
    console.log(test);
    console.log("TES");
  }
};

export const convertFileToRGBMatrix = async (
  file: File
): Promise<RGBMatrix> => {
  // Convert from file to buffer (Jimp accepts buffer)
  const blob = new Blob([file]);
  const arrBuff = await blob.arrayBuffer();
  const buffer = Buffer.from(arrBuff);

  const rgbMatrix: RGBMatrix = [];

  // @ts-expect-error
  Jimp.read(buffer, (err, image) => {
    if (err) throw err;

    const width = image.getWidth();
    const height = image.getHeight();

    for (let i = 0; i < height; i++) {
      let row: RGB[] = [];
      for (let j = 0; j < width; j++) {
        const pixel = Jimp.intToRGBA(image.getPixelColor(j, i));
        const { r, g, b } = pixel;

        row.push([r, g, b]);
      }
      rgbMatrix.push(row);
    }
  });

  return rgbMatrix;
};
