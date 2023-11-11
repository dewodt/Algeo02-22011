import { type Metadata } from "next";

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
    "Choose option to compare query with uploading a dataset or scraping a dataset from a link.",
    "Upload your input/query image to compare with dataset.",
    "Choose to compare by color or by texture.",
    "If you chose upload dataset, upload your data set. Otherwise, input a link to scrape.",
    "Click the search button!",
    "You can see the result with pagination or you can also download the pdf!",
  ];

  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-4 lg:max-w-3xl lg:gap-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          How To Use HBD Lens
        </h1>

        {/* Steps */}
        <ol className="flex list-decimal flex-col gap-2 lg:gap-4">
          {steps.map((step, idx) => {
            return (
              <li key={idx} className="text-lg marker:font-bold lg:text-xl ">
                {step}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
};

export default HowToUse;
