import { type Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How To Use | HBD Lens",
  description:
    "HBD Lens is a reverse search image tool using content-based image retrieval (CBIR) method.",
  generator: "Next.js",
  applicationName: "HBD Lens",
  themeColor: "#16A34A",
};

const HowToUse = () => {
  const steps = [
    {
      step: "Choose option to compare query with uploading a dataset or scraping a dataset from a link.",
      imageUrls: ["/how-options.png"],
    },
    {
      step: "Upload your input/query image to compare with dataset or you can capture an image using your webcam.",
      imageUrls: ["/how-input-query.png"],
    },
    {
      step: "Choose to compare by color or by texture.",
      imageUrls: ["/how-color-texture.png"],
    },
    {
      step: "If you chose upload dataset, upload your data set. Otherwise, input a link to scrape.",
      imageUrls: ["/how-input-dataset.png", "/how-input-link.png"],
    },
    {
      step: "Click the search button!",
      imageUrls: ["/how-search.png"],
    },
    {
      step: "You can see the result with pagination or you can also download the pdf!",
      imageUrls: ["/how-results.png"],
    },
  ];

  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-4 lg:max-w-3xl lg:gap-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          How To Use HBD Lens
        </h1>

        {/* Steps */}
        <ol className="flex list-decimal flex-col gap-4 pl-5">
          {steps.map((step, idx) => {
            return (
              <li
                key={idx}
                className="text-justify text-lg marker:font-bold lg:text-xl"
              >
                <span>{step.step}</span>
                {step.imageUrls.map((imageUrl, idx) => {
                  return (
                    <Image
                      key={idx}
                      src={imageUrl}
                      className="mx-auto my-4 h-auto w-full rounded-lg border-2 border-border sm:w-3/5"
                      alt={step.step}
                      width={400}
                      height={300}
                    />
                  );
                })}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
};

export default HowToUse;
