import { type NextRequest, NextResponse } from "next/server";
import { solveCBIR } from "@/lib/cbir";
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
    console.log(zodParseResult.error.errors);
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid data format" },
      { status: 400 }
    );
  }

  // Get data
  const { imageInput, isTexture, imageDataSet } = zodParseResult.data;

  // Process data
  const CBIRColorResult = await solveCBIR(imageInput, imageDataSet, isTexture);

  // Return response
  return NextResponse.json(CBIRColorResult);
};
