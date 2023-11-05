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
            How to Use
          </h1>
          <div className="text-[12px] md:text-[15px] lg:text-lg xl:text-xl md:pl-[40px]">
            Berikut cara menggunakan HBD Lens: <br />
            1. Upload database berupa folder yang berisi foto dalam format .png <br />
            2. Upload image referensi <br />
            3. Pilih aspek yang akan digunakan sebagai penentu kemiripan, terdapat dua pilihan yakni warna dan tekstur <br />
            <div className="font-semibold">Tips:</div> Warna untuk warna kulit atau waktu seperti pagi, siang, dll <br />
            Tekstur untuk menentukan ekspresi atau kontur kota <br />
            4. Klik search untuk mendapatkan nilai kemiripan
          </div>
          
        </section>
      </main>
    );
  };
  
  export default Tes;