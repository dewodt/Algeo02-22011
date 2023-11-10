import { type NextRequest, NextResponse } from "next/server";
import { convertFileToBuffer, solveCBIR } from "@/lib/cbir";
import { SearchByUploadHttpSchema } from "@/lib/zod";

export const POST = async (req: NextRequest) => {
  // Get data from form data
  const formData = await req.formData();
  const rawImageInput = formData.get("imageInput");
  const rawIsTexture = JSON.parse(formData.get("isTexture") as string);
  const rawImageDataset = formData.getAll("imageDataSet");

  const rawDataObject = {
    imageInput: rawImageInput,
    isTexture: rawIsTexture,
    imageDataSet: rawImageDataset,
  } as unknown;

  // Validate data
  const zodParseResult = SearchByUploadHttpSchema.safeParse(rawDataObject);
  if (!zodParseResult.success) {
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid data format" },
      { status: 400 }
    );
  }

  // Get data
  const { imageInput, isTexture, imageDataSet } = zodParseResult.data;

  // Convert image input to buffer
  const imageInputBuffer = await convertFileToBuffer(imageInput);

  // Convert files to buffers paralelly (faster than sequentially)
  const imageDataSetBuffer = await Promise.all(
    imageDataSet.map(async (file) => await convertFileToBuffer(file))
  );

  // Process data
  const CBIRColorResult = await solveCBIR(
    imageInputBuffer,
    imageDataSetBuffer,
    isTexture
  );

  // Return response
  return NextResponse.json(CBIRColorResult);
};
