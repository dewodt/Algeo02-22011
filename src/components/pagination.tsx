// Pagination with 7 blocks

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, type SetStateAction } from "react";

const Pagination = ({
  countPage,
  page,
  setPage,
}: {
  countPage: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  return (
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
      ) : page <= 5 ? (
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
  );
};

export default Pagination;
