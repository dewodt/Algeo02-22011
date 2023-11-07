import { type NextRequest, NextResponse } from "next/server";
import { solveCBIRColor } from "@/lib/cbir";

export const POST = async (req: NextRequest) => {
  // Get data
  const formData = await req.formData();
  const imageInput = formData.get("image_input") as File;
  const isTexture = JSON.parse(formData.get("is_texture") as string) as boolean;
  const imageDataset = formData.getAll("image_dataset") as File[];

  // Process data
  if (isTexture) {
    // Solve texture
  } else {
    // Solve color
    const CBIRColorResult = await solveCBIRColor(imageInput, imageDataset);

    // Return response
    return NextResponse.json(CBIRColorResult);
  }
};
