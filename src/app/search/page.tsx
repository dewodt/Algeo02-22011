import { type Metadata } from "next";
import SearchForm from "./search-form";

export const metadata: Metadata = {
  title: "Search | HBD Lens",
  description: "Reverse image.",
};

const SearchPage = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
      <section className="flex w-full flex-col gap-5 lg:max-w-4xl lg:gap-10">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold lg:text-4xl">
          Reverse Image Search
        </h1>

        {/* Form & Client Component */}
        <SearchForm />
      </section>
    </main>
  );
};

export default SearchPage;
