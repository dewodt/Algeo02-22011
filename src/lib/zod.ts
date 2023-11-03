import * as z from "zod";
import { allowedImagesTypes } from "./constants";

export const SearchFormSchema = z.object({
  image_input: z
    .custom<File>((input) => input instanceof File, "Please select input image")
    .refine(
      (file) => allowedImagesTypes.includes(file!.type),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
  is_color: z.boolean(),
  image_dataset: z
    .custom<FileList>(
      (input) => input instanceof FileList,
      "Please select dataset images"
    )
    .refine(
      (files) =>
        !Array.from(files).some(
          (file) => !allowedImagesTypes.includes(file!.type)
        ),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
});
