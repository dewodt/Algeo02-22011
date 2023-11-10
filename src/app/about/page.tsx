import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | HBD Lens",
  description: "About",
};

const HowToUse = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-4 lg:max-w-3xl lg:gap-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          About HBD Lens
        </h1>

        {/* Steps */}
        <p className="text-justify text-lg leading-relaxed lg:text-xl lg:leading-relaxed">
          Welcome to HBD Lens, a cutting-edge project crafted by the ingenious
          minds of Haikal, Bana, and Dewo (Hence called HBD) from the Bandung
          Institute of Technology. This was made to fullfill the final task of
          linear algebra and geometry course. This project, a reverse image
          query utilizing Content-Based Image Retrieval (CBIR) technology. This
          project is fully open source and can be accessed by{" "}
          <Link href="https://github.com/dewodt/Algeo02-22011">
            <Button
              variant="link"
              className="p-0 text-lg leading-relaxed lg:text-xl lg:leading-relaxed"
            >
              this
            </Button>
          </Link>{" "}
          link.
        </p>
      </section>
    </main>
  );
};

export default HowToUse;
