"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageResult } from "@/types/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ImageResults = ({ imageResults }: { imageResults: ImageResult[] }) => {
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
          const url = URL.createObjectURL(image.image);
          return (
            <div key={idx} className="relative">
              <Image
                className="aspect-[5/3] w-full rounded-lg border-2 border-border object-cover object-center"
                src={url}
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
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        {/* Previous */}
        <Button
          size="icon"
          variant="secondary"
          disabled={page == 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft />
        </Button>

        {countPage <= 7 ? (
          <>
            {/* Less than 7 elements, don't need to use ... */}
            {Array.from({ length: countPage }, (_, idx) => {
              const num = idx + 1;
              return (
                <Button
                  key={num}
                  variant={num == page ? "default" : "secondary"}
                  onClick={() => setPage(num)}
                >
                  {num}
                </Button>
              );
            })}
          </>
        ) : (
          <>
            {page <= 5 ? (
              <>
                {/* 1 ~ 5 ... countPage */}
                {/* 1 ~ 5 */}
                {Array.from({ length: 5 }, (_, idx) => {
                  const num = idx + 1;
                  return (
                    <Button
                      key={num}
                      variant={num == page ? "default" : "secondary"}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </Button>
                  );
                })}

                {/* ... */}
                <Button variant="secondary" disabled>
                  <MoreHorizontal />
                </Button>

                {/* countPage */}
                <Button
                  variant={countPage == page ? "default" : "secondary"}
                  onClick={() => setPage(countPage)}
                >
                  {countPage}
                </Button>
              </>
            ) : page >= countPage - 4 ? (
              <>
                {/* 1 ... countPage-4 ~ countPage */}
                {/* 1 */}
                <Button
                  variant={1 == page ? "default" : "secondary"}
                  onClick={() => setPage(1)}
                >
                  1
                </Button>

                {/* ... */}
                <Button variant="secondary" disabled>
                  <MoreHorizontal />
                </Button>

                {/* countPage-4 ~ countPage */}
                {Array.from({ length: 5 }, (_, idx) => {
                  const num = countPage - 4 + idx;
                  return (
                    <Button
                      key={num}
                      variant={num == page ? "default" : "secondary"}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </Button>
                  );
                })}
              </>
            ) : (
              <>
                {/* 1 ... page-1 page page+1 ... countPage */}
                {/* 1 */}
                <Button
                  variant={1 == page ? "default" : "secondary"}
                  onClick={() => setPage(1)}
                >
                  1
                </Button>

                {/* ... */}
                <Button variant="secondary" disabled>
                  <MoreHorizontal />
                </Button>

                {/* page-1 page page+1 */}
                {Array.from({ length: 3 }, (_, idx) => {
                  const num = page - 1 + idx;
                  return (
                    <Button
                      key={`${num}_${page}`}
                      variant={num == page ? "default" : "secondary"}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </Button>
                  );
                })}

                {/* ... */}
                <Button variant="secondary" disabled>
                  <MoreHorizontal />
                </Button>

                {/* countPage */}
                <Button
                  variant={countPage == page ? "default" : "secondary"}
                  onClick={() => setPage(countPage)}
                >
                  {countPage}
                </Button>
              </>
            )}
          </>
        )}

        {/* Next */}
        <Button
          size="icon"
          variant="secondary"
          disabled={page == countPage}
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default ImageResults;
