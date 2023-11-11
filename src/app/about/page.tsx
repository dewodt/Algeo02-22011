import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | HBD Lens",
  description: "Reverse image.",
};

const Tes = () => {
    return (
        <main className="flex flex-auto flex-col items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
        <section className="flex w-full flex-col gap-5 lg:max-w-4xl lg:gap-10">
          {/* Title */}
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            About
          </h1>
          <div className="text-[12px] md:text-[15px] lg:text-lg xl:text-xl md:pl-[40px] text-align:justify">
            <strong>HBD Lens</strong> merupakan web yang dapat melakukan image processing untuk menentukan kesamaan antar satu gambar dengan gambar lainnya,
            web ini menggunakan metode CBIR (Content-Based Image Retrieval) berdasarkan warna (CBIR color) dan tekstur (CBIR texture), web ini juga memiliki user
             interface yang menarik dan memudahkan pengguna.

          </div>
          
        </section>
      </main>
    );
  };
  
  export default Tes;