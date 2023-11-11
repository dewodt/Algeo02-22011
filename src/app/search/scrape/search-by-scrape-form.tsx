"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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
import { ErrorResponse, SuccessSearchByScrapeResponse } from "@/types/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Camera, FileText, Loader2, Search } from "lucide-react";
import ResultGallery from "../result-gallery";
import ResultPDF from "../result-pdf";
import { LastValidSearchState } from "@/types/hooks";
import Webcam from "react-webcam";

// Search form & shows result client component
const SearchByScrapeForm = () => {
  // Last valid submission state
  // Initial state: undefined
  // Final state: LastValidSearchState
  const [lastValidSearch, setLastValidSearch] =
    useState<LastValidSearchState>(undefined);

  // Form state
  const form = useForm<z.infer<typeof SearchByScrapeFormSchema>>({
    resolver: zodResolver(SearchByScrapeFormSchema),
    defaultValues: {
      isTexture: false,
    },
  });
  const { control, handleSubmit, watch, formState, setValue } = form;
  const { isSubmitting } = formState;

  // Webcam ref
  const [isCameraCapturing, setIsCameraCapturing] = useState<boolean>(false);
  const [captureTimeLeft, setCaptureTimeLeft] = useState<number>(10);
  const webCamRef = useRef<Webcam>(null);
  const onClickCapture = () => {
    // Start countdown 10 seconds
    setIsCameraCapturing(true);
    setCaptureTimeLeft(10);

    // Countdown 10 seconds
    const interval = setInterval(() => {
      if (captureTimeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      setCaptureTimeLeft((prev) => prev - 1);
    }, 1000);

    // Capture after 10 seconds
    setTimeout(() => {
      // Get base 64 image
      const cameraBase64 = webCamRef.current?.getScreenshot();

      if (!cameraBase64) {
        return;
      }

      // Convert buffer => file
      const arr = cameraBase64.split(",");
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "camera.jpg", { type: mime });

      // Set image input
      setValue("imageInput", file);
      setIsCameraCapturing(false);
    }, 10000);
  };

  // Image input state
  // (Anything that the user inputs, even if it's invalid)
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
    setLastValidSearch(undefined);

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
    setLastValidSearch({
      imageInputSrc: URL.createObjectURL(data.imageInput),
      isTexture: data.isTexture,
      scrapeUrl: data.scrapeUrl,
      timeTaken: timeEnd - timeStart,
      imageResults: imageResults,
    });

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
          {/* Shows current inputed image / webcam */}
          <div className="aspect-[5/3] w-full overflow-hidden rounded-lg border-2 border-border bg-muted sm:h-48 sm:w-auto md:h-56 lg:h-72">
            {isCameraCapturing ? (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                className="h-full w-full rounded-lg object-cover object-center"
                ref={webCamRef}
              />
            ) : (
              imageInputURL && (
                <Image
                  className="h-full w-full rounded-lg object-cover object-center"
                  src={imageInputURL}
                  alt="Input Image"
                  width={320}
                  height={160}
                />
              )
            )}
          </div>

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

            {/* Or */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or Camera (10 s Countdown)
                </span>
              </div>
            </div>

            {/* Camera Button */}
            <Button
              size="lg"
              variant="secondary"
              type="button"
              onClick={onClickCapture}
              disabled={isCameraCapturing || isSubmitting}
            >
              {isCameraCapturing ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Capturing in {captureTimeLeft} S...
                </>
              ) : (
                <>
                  <Camera className="mr-2" />
                  Capture
                </>
              )}
            </Button>

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
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting || isCameraCapturing}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 " />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Image results */}
        {lastValidSearch && (
          <>
            <Separator orientation="horizontal" />
            <div className="flex flex-col gap-4">
              {/* Results Title*/}
              <div className="sm:flex sm:flex-row sm:justify-between">
                <h3 className="font-bold">Results:</h3>
                <p className="text-sm">
                  {lastValidSearch.imageResults.length} Results in{" "}
                  {lastValidSearch.timeTaken.toFixed(2)} Seconds
                </p>
              </div>

              {/* Results Images + Pagination */}
              {lastValidSearch.imageResults.length > 0 && (
                <ResultGallery imageResults={lastValidSearch.imageResults} />
              )}

              {/* Convert result to pdf button */}
              <PDFDownloadLink
                className="w-full self-center sm:max-w-xs"
                document={<ResultPDF lastValidSearch={lastValidSearch} />}
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
                        <Loader2 className="mr-2 animate-spin" />
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
