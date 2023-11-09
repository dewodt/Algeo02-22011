import { type NextRequest, NextResponse } from "next/server";
import { solveCBIRColor } from "@/lib/cbir";
import { SearchByUploadHttpSchema } from "@/lib/zod";
import { SuccessSearchByUploadResponse } from "@/types/api";

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

  // Process data
  if (isTexture) {
    // Solve texture
  } else {
    // Solve color
    const CBIRColorResult: SuccessSearchByUploadResponse = await solveCBIRColor(
      imageInput,
      imageDataSet
    );

    // Return response
    return NextResponse.json(CBIRColorResult);
  }
};
