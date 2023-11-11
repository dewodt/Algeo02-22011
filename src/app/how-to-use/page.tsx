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
            <strong>1.</strong> Upload dataset image terlebih dahulu, dapat menggunakan input dari folder maupun mencantumkan link sebuah web untuk mengambil fotonya. <br />
            <strong>2.</strong> Upload image referensi, bisa mnggunakan file maupun menggunakan kamera. <br />
            <strong>3.</strong> Pilih aspek yang akan digunakan sebagai penentu kemiripan, terdapat dua pilihan yakni warna dan tekstur. <strong>Tips:</strong> Warna untuk warna kulit atau waktu seperti pagi, siang, dll <br />
            Tekstur untuk menentukan ekspresi atau kontur kota. <br />
            <strong>4.</strong> Klik search untuk mendapatkan hasil, hasil yang ditampilkan yakni gambar yang memiliki kemiripan di atas 60%, dengan gambar yang pertama kali dimunculkan yaitu gambar dengan kemiripan tertinggi.
          </div>
          
        </section>
      </main>
    );
  };
  
  export default Tes;