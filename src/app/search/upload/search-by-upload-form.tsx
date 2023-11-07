"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchByUploadFormSchema } from "@/lib/zod";
import { type ImageResult } from "@/types/image";
import { SearchByUploadDataSetResponse } from "@/types/api";
import ImageResults from "../image-results";

// Search form & shows result client component
const SearchByUploadForm = () => {
  // Image results state
  // Initial state: undefined
  // No results state: []
  // Has results state: [Images, ...]
  const [imageResults, setImageResults] = useState<ImageResult[] | undefined>(
    undefined
  );

  // Time taken state
  // Initial state: undefined
  // Final state: number
  const [timeTaken, setTimeTaken] = useState<number | undefined>(undefined);

  const form = useForm<z.infer<typeof SearchByUploadFormSchema>>({
    resolver: zodResolver(SearchByUploadFormSchema),
    defaultValues: {
      is_texture: false,
    },
  });
  const { control, handleSubmit, watch, formState } = form;
  const { isSubmitting } = formState;

  // Image input state
  const imageInput = watch("image_input");
  const imageInputURL = imageInput
    ? URL.createObjectURL(imageInput)
    : undefined;

  // Submit handler
  const onSubmit = async (data: z.infer<typeof SearchByUploadFormSchema>) => {
    // Toast
    toast({
      title: "Loading...",
      description: "Please wait.",
      duration: Infinity,
    });

    // Reset image results & time taken
    setImageResults(undefined);
    setTimeTaken(undefined);

    // Start timer
    const timeStart = Date.now() / 1000;

    // Initiate form data
    const formData = new FormData();
    formData.append("image_input", data.image_input);
    formData.append("is_texture", data.is_texture.toString());
    const imageDataSet = Array.from(data.image_dataset);
    imageDataSet.forEach((image) => {
      formData.append("image_dataset", image);
    });

    // Fetch to end point to be processed
    const res = await fetch("/api/search/upload/", {
      body: formData,
      method: "POST",
    });

    if (!res.ok) {
      // Toast error
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });

      return;
    }

    const resJSON: SearchByUploadDataSetResponse[] = await res.json();

    // Create image results mapping
    const imageResults: ImageResult[] = resJSON.map((result) => {
      const { index, similarity } = result;
      return {
        image: imageDataSet[index],
        similarity: similarity,
      };
    });

    // Stop timer
    const timeEnd = Date.now() / 1000;

    // Set image results & time taken
    setImageResults(imageResults);
    setTimeTaken(timeEnd - timeStart);

    // Toast success
    toast({
      variant: "success",
      title: "Success!",
      description: "Image results are shown below.",
      duration: 5000,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 lg:gap-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
          {/* Shows current inputed image */}
          {imageInputURL ? (
            <Image
              className="aspect-[5/3] w-full rounded-lg border-2 border-border object-cover object-center sm:h-48 sm:w-auto md:h-56 lg:h-64"
              src={imageInputURL}
              alt="Input Image"
              width={320}
              height={160}
            />
          ) : (
            <div className="aspect-[5/3] w-full rounded-lg border-2 border-border bg-muted sm:h-48 sm:w-auto md:h-56 lg:h-64" />
          )}

          <div className="flex flex-col gap-4">
            {/* Image Query Input */}
            <FormField
              control={control}
              name="image_input"
              render={({ field: { onChange }, ...field }) => (
                <FormItem>
                  <FormLabel>Image Query</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Upload Image Query"
                      onChange={(e) => onChange(e.target.files![0])}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              {/* Toggle Color vs Texture */}
              <FormField
                control={control}
                name="is_texture"
                render={({ field }) => (
                  <>
                    <FormLabel>Calculation Method</FormLabel>
                    <FormItem className="flex items-center justify-center rounded-md border p-4">
                      <div className="flex flex-row items-center gap-2">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Texture</FormLabel>
                      </div>
                    </FormItem>
                  </>
                )}
              />

              {/* Search / submit button */}
              <Button size="lg" type="submit" disabled={isSubmitting}>
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Image results */}
        {imageResults && (
          <>
            <Separator orientation="horizontal" />
            <div className="flex flex-col gap-4">
              {/* Results Title*/}
              <div className="sm:flex sm:flex-row sm:justify-between">
                <h3 className="font-bold">Results:</h3>
                <p className="text-sm">
                  {imageResults.length} Results in {timeTaken!.toFixed(2)}{" "}
                  Seconds
                </p>
              </div>

              {/* Results Images + Pagination */}
              {imageResults.length > 0 && (
                <ImageResults imageResults={imageResults} />
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Image Dataset Input */}
        <FormField
          control={control}
          name="image_dataset"
          render={({ field: { onChange }, ...field }) => (
            <FormItem>
              <FormLabel>Image Dataset</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload Image Dataset"
                  // @ts-expect-error
                  webkitdirectory=""
                  directory=""
                  onChange={(e) => onChange(e.target.files!)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchByUploadForm;
