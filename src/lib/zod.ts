import * as z from "zod";
import { allowedImagesTypes } from "./constants";

export const SearchByUploadFormSchema = z.object({
  imageInput: z
    .custom<File>((input) => input instanceof File, "Please select query image")
    .refine(
      (file) => allowedImagesTypes.includes(file!.type),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
  isTexture: z.boolean(),
  imageDataSet: z
    .custom<FileList>(
      (input) => input instanceof FileList,
      "Please select dataset images"
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          allowedImagesTypes.includes(file!.type)
        ),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
});

export const SearchByUploadHttpSchema = z.object({
  imageInput: z
    .custom<File>((input) => input instanceof File, "Please select query image")
    .refine(
      (file) => allowedImagesTypes.includes(file!.type),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
  isTexture: z.boolean(),
  imageDataSet: z
    .custom<File[]>(
      (files) =>
        Array.isArray(files) && files.every((file) => file instanceof File),
      "Please select dataset images"
    )
    .refine(
      (files) => files.every((file) => allowedImagesTypes.includes(file!.type)),
      "Only these types are allowed .jpg, .jpeg, and .png"
    ),
});
