import { type Metadata } from "next";
import SearchByUploadForm from "./search-by-upload-form";

export const metadata: Metadata = {
  title: "Search By Upload Data Set | HBD Lens",
  description:
    "HBD Lens is a reverse search image tool using content-based image retrieval (CBIR) method.",
  generator: "Next.js",
  applicationName: "HBD Lens",
};

const SearchPage = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-5 lg:max-w-4xl lg:gap-10">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          Reverse Image Search By Upload Data Set
        </h1>

        {/* Form & Client Component */}
        <SearchByUploadForm />
      </section>
    </main>
  );
};

export default SearchPage;
