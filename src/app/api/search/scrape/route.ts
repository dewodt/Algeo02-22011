import { type NextRequest, NextResponse } from "next/server";
import { SearchByScrapeFormSchema } from "@/lib/zod";
import { JSDOM } from "jsdom";
import { convertFileToBuffer, solveCBIR } from "@/lib/cbir";
import { SuccessSearchByScrapeResponse } from "@/types/api";

export const POST = async (req: NextRequest) => {
  // Get data
  const formData = await req.formData();
  const rawImageInput = formData.get("imageInput") as File;
  const rawIsTexture = JSON.parse(
    formData.get("isTexture") as string
  ) as boolean;
  const rawScrapeUrl = formData.get("scrapeUrl") as string;

  const rawDataObject = {
    imageInput: rawImageInput,
    isTexture: rawIsTexture,
    scrapeUrl: rawScrapeUrl,
  };

  // Validate data
  const zodParseResult = SearchByScrapeFormSchema.safeParse(rawDataObject);
  if (!zodParseResult.success) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Invalid data format",
      },
      { status: 400 }
    );
  }

  // Get validated data
  const { imageInput, isTexture, scrapeUrl } = zodParseResult.data;

  // Get html from url
  const res = await fetch(scrapeUrl);
  const html = await res.text();
  const dom = new JSDOM(html);

  // Get images from html
  const document = dom.window.document;
  const imageElements = Array.from(document.querySelectorAll("img"));
  const imageUrls = imageElements.map((element) => {
    const rawUrl = element.getAttribute("src");
    if (rawUrl?.startsWith("https://")) {
      // Absolute url, already contains https://
      return rawUrl;
    } else {
      // Relative url, need to add scrapeUrl
      return `${scrapeUrl}${rawUrl}`;
    }
  });

  // Convert image input to buffer
  const imageInputBuffer = await convertFileToBuffer(imageInput);

  // Convert scraped urls to buffers paralelly (faster than sequentially)
  const processedImages = await Promise.all(
    imageUrls.map(async (url) => {
      const res = await fetch(url);

      const arrBuff = await res.arrayBuffer();
      const imageBuffer = Buffer.from(arrBuff);
      const contentType = res.headers.get("content-type") as string;
      const imageBase64 = imageBuffer.toString("base64");
      const imageSrc = `data:${contentType};base64,${imageBase64}`;

      return {
        imageBuffer,
        imageSrc,
      };
    })
  );

  // Get array of image buffers
  const imageDataSetBuffers = processedImages.map((image) => image.imageBuffer);

  // Get image src
  const imageDataSetSrcs = processedImages.map((image) => image.imageSrc);

  const CBIRResult = await solveCBIR(
    imageInputBuffer,
    imageDataSetBuffers,
    isTexture
  );

  // Return response
  const imageResults: SuccessSearchByScrapeResponse = CBIRResult.map(
    (result) => {
      const { index, similarity } = result;
      const imageSrc = imageDataSetSrcs[index];

      return {
        imageSrc,
        similarity,
      };
    }
  );

  return NextResponse.json(imageResults);
};
