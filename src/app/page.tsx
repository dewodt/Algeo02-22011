import Image from "next/image";
import Link from "next/link";
import { type Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "HBD Lens",
  description:
    "HBD Lens is a reverse search image tool using content-based image retrieval (CBIR) method.",
  generator: "Next.js",
  applicationName: "HBD Lens",
  themeColor: "#16A34A",
};

const HomePage = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      {/* Landing Hero Section */}
      <section className="flex w-full max-w-7xl flex-col items-center gap-6 sm:flex-row-reverse lg:gap-20">
        {/* Lens Image */}
        <Image
          className="w-3/5 max-w-xs sm:w-1/4 lg:w-2/5 lg:max-w-sm"
          src="/lens.png"
          alt="Lens Logo"
          width={400}
          height={400}
        />

        {/* Texts */}
        <div className="flex flex-col items-start gap-3 lg:gap-6">
          <h1 className="text-4xl font-bold lg:text-6xl">
            Search Your Image Easily.
          </h1>
          <p className="text-base text-muted-foreground lg:text-xl">
            Here at HBD Lens, you can upload a dataset of images and a query
            image to find the most similiar photo from your dataset with your
            query image!
          </p>
          <Link href="/search">
            <Button size="lg">
              Try now!
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
