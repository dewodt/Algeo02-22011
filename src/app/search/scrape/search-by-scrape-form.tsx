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
import { SearchByScrapeFormSchema } from "@/lib/zod";
import { ImageResultsState } from "@/types/image";
import { ErrorResponse, SuccessSearchByScrapeResponse } from "@/types/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileText, Loader } from "lucide-react";
import ResultGallery from "../result-gallery";
import ResultPDF from "../result-pdf";

// Search form & shows result client component
const SearchByScrapeForm = () => {
  // Image results state
  // Initial state: undefined
  // No results state: []
  // Has results state: [Images, ...]
  const [imageResults, setImageResults] =
    useState<ImageResultsState>(undefined);

  // Time taken state
  // Initial state: undefined
  // Final state: number
  const [timeTaken, setTimeTaken] = useState<number | undefined>(undefined);

  const form = useForm<z.infer<typeof SearchByScrapeFormSchema>>({
    resolver: zodResolver(SearchByScrapeFormSchema),
    defaultValues: {
      isTexture: false,
    },
  });
  const { control, handleSubmit, watch, formState } = form;
  const { isSubmitting } = formState;

  // Image input state
  const imageInput = watch("imageInput");
  const imageInputURL = imageInput
    ? URL.createObjectURL(imageInput)
    : undefined;

  // Submit handler
  const onSubmit = async (data: z.infer<typeof SearchByScrapeFormSchema>) => {
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
    formData.append("imageInput", data.imageInput);
    formData.append("isTexture", data.isTexture.toString());
    formData.append("scrapeUrl", data.scrapeUrl);

    // Fetch to end point to be processed
    const res = await fetch("/api/search/scrape/", {
      body: formData,
      method: "POST",
    });
    const resJSON: SuccessSearchByScrapeResponse | ErrorResponse =
      await res.json();

    if (!res.ok) {
      const errorJSON = resJSON as ErrorResponse;
      // Toast error
      toast({
        variant: "destructive",
        title: errorJSON.error,
        description: errorJSON.message,
        duration: 5000,
      });

      return;
    }

    // // Create image results mapping
    const imageResults = resJSON as SuccessSearchByScrapeResponse;

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
              name="imageInput"
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
                name="isTexture"
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
                <ResultGallery imageResults={imageResults} />
              )}

              {/* Convert result to pdf button */}
              <PDFDownloadLink
                className="w-full self-center sm:max-w-xs"
                document={
                  <ResultPDF
                    imageInput={imageInput}
                    imageResults={imageResults}
                    timeTaken={timeTaken!}
                  />
                }
                fileName="Reverse Image Result.pdf"
              >
                {({ loading }) => (
                  <Button
                    size="lg"
                    variant="secondary"
                    type="button"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2" />
                        Convert to PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </>
        )}

        <Separator />

        {/* Image Dataset Scrape */}
        <FormField
          control={control}
          name="scrapeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Data Set Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter image data set link to scrape"
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

export default SearchByScrapeForm;
