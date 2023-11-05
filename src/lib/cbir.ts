// @ts-expect-error
import Jimp from "jimp/es";
import { rgbnxnx } from "@/types/matrix";
import { RGBMatrix } from "@/types/matrix";
import { RGB } from "@/types/image";
import { count, time } from "console";
import { hsv } from "@/types/matrix";
import { hsvarray } from "@/types/matrix";

export const solveCBIRWithUploadDataSet = async (
  imageQuery: File,
  isTexture: boolean,
  imageDataSet: FileList
) => {
  console.log(imageQuery);
  console.log(imageDataSet);
  if (isTexture) {
    // Handle texture method query
  } else {
    // Handle color method query
    console.log("TES");
    const test = await convertFileToRGBMatrix(imageQuery);
    console.log(test); // Hasil akhir berupa matriks 1x9 ratarata rgb
    const hsv = await rgbtohsv(test);
    console.log(hsv);
    console.log("TES");
  }
};

export const convertFileToRGBMatrix = async (
  file: File
): Promise<rgbnxnx> => {
  // Convert from file to buffer (Jimp accepts buffer)
  const blob = new Blob([file]);
  const arrBuff = await blob.arrayBuffer();
  const buffer = Buffer.from(arrBuff);
  const rgbnxn: rgbnxnx = [];
  const rgbMatrix: RGBMatrix = [];

  // @ts-expect-error
  Jimp.read(buffer, (err, image) => {
    if (err) throw err;

    const width = image.getWidth();
    const width3x3 = Math.floor(width / 3);
    const height = image.getHeight();
    const height3x3 = Math.floor(height / 3);

    for (let i = 0; i < height; i++) {
      let row: RGB[] = [];
      for (let j = 0; j < width; j++) {
        const pixel = Jimp.intToRGBA(image.getPixelColor(j, i));
        const { r, g, b } = pixel;

        row.push([r, g, b]);
      }
      rgbMatrix.push(row);
    }
// Membagi matriks menjadi 3x3
      for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              let red = 0;
              let green = 0;
              let blue = 0;
              let count = 0;
              for (let tinggi = i*height3x3; tinggi < (i+1)*height3x3; tinggi++) {
                for (let lebar = j*width3x3; lebar < (j+1)*width3x3; lebar++) {
                  red += rgbMatrix[tinggi][lebar][0];
                  green += rgbMatrix[tinggi][lebar][1];
                  blue += rgbMatrix[tinggi][lebar][2];
                  count += 1;
                }
              }
              rgbnxn.push([Math.floor(red/count),Math.floor(green/count),Math.floor(blue/count)]);
            }
          }

   });
  return rgbnxn;
};

export const rgbtohsv = async (
  matriksrgb : rgbnxnx
): Promise<hsvarray> => {
  const arrayhsv: hsvarray = [];
  console.log(matriksrgb[0][0]);
  for (let i = 0; i < 9; i++) {
    let raksen = matriksrgb?.[i]?.[0] / 255;
    let gaksen = matriksrgb?.[i]?.[1] / 255;
    let baksen = matriksrgb?.[i]?.[2] / 255;
    let aksen = [raksen,gaksen,baksen];
    let maksimal = 0;
    let minimal = 2;
    for (let j = 0; j < 3; j++) {
      if (maksimal < aksen[i]) {
        maksimal = aksen[i];
      }
      if (minimal > aksen[i]) {
        minimal = aksen[i];
      }
    }
    let h = 0;
    let s = 0;
    let selisih = maksimal - minimal;
    if (selisih == 0) {
      h = 0;
    }
    else if (maksimal == raksen) {
      h = 60*(((gaksen-baksen)/selisih)%6); 
    }
    else if (maksimal == baksen) {
      h = 60*(((baksen-raksen)/2)+2);
    }
    else if (maksimal == gaksen) {
      h = 60*(((raksen-gaksen)/2)+4);
    }
    if (maksimal == 0) {
      s = 0;
    }
    else {
      s = selisih/maksimal*100;
    }
    let v = maksimal*100;
    arrayhsv.push([h,s,v]);
  }

  return arrayhsv;
}
