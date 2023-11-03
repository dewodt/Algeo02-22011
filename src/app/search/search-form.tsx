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
import { SearchFormSchema } from "@/lib/zod";
import { type ImageResult } from "@/types/image";
import ImageResults from "./image-results";

// Search form & shows result client component
const SearchForm = () => {
  // Image results state
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);

  const form = useForm<z.infer<typeof SearchFormSchema>>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      is_color: false,
    },
  });
  const { control, handleSubmit, watch } = form;
  // Image input state
  const imageInput = watch("image_input");
  const imageInputURL = imageInput
    ? URL.createObjectURL(imageInput)
    : undefined;

  const onSubmit = async (data: z.infer<typeof SearchFormSchema>) => {
    console.log(data);

    // TO TEST PAGINATION
    // setImageResults(Array.from(data.image_dataset));
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
                name="is_color"
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
              <Button size="lg" type="submit">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Image results */}
        {imageResults.length > 0 && (
          <>
            <Separator orientation="horizontal" />
            <div className="flex flex-col gap-4">
              {/* Results Title*/}
              <div className="sm:flex sm:flex-row sm:justify-between">
                <h3 className="font-bold">Results:</h3>
                <p className="text-sm">X Results in N Seconds</p>
              </div>

              {/* Results Images + Pagination */}
              <ImageResults imageResults={imageResults} />
            </div>
          </>
        )}

        <Separator />

        {/* Upload datasets */}
        <div>
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
                    onChange={(e) => {
                      onChange(e.target.files);

                      // TO TEST PAGINATION
                      const newImages = Array.from(e.target.files!).map(
                        (image) => {
                          return {
                            image: image,
                            similarity: Math.random(),
                          };
                        }
                      );

                      setImageResults(newImages);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;
