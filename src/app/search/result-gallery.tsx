"use client";

import { ImageResults } from "@/types/image";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/pagination";

const ResultGallery = ({ imageResults }: { imageResults: ImageResults }) => {
  // Count total result & total pages
  const countResult = imageResults.length;
  const countPage = Math.ceil(countResult / 6);

  // Pagination state
  const [page, setPage] = useState(1);
  const currentPage = imageResults.slice((page - 1) * 6, page * 6);

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      {/* Images */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {currentPage.map((image, idx) => {
          return (
            // Image with label
            <div key={idx} className="relative">
              <Image
                className="aspect-[5/3] w-full rounded-lg border-2 border-border object-cover object-center"
                src={image.imageSrc}
                alt={`Image result #${idx + 1}`}
                width={100}
                height={100}
              />
              <Badge className="absolute bottom-2 left-0 right-0 mx-auto w-fit">
                {(image.similarity * 100).toFixed(2)}%
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination countPage={countPage} page={page} setPage={setPage} />
    </div>
  );
};

export default ResultGallery;
