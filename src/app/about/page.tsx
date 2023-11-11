import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | HBD Lens",
  description:
    "HBD Lens is a reverse search image tool using content-based image retrieval (CBIR) method.",
  generator: "Next.js",
  applicationName: "HBD Lens",
  themeColor: "#16A34A",
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
        <strong>HBD Lens</strong> merupakan web yang dapat melakukan image processing untuk menentukan kesamaan antar satu gambar dengan gambar lainnya,
            web ini menggunakan metode CBIR (Content-Based Image Retrieval) berdasarkan warna (CBIR color) dan tekstur (CBIR texture), web ini juga memiliki user
             interface yang menarik dan memudahkan pengguna.{" "}
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