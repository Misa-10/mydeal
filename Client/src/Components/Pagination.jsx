import React, { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Pagination = ({ totalPages, onPageChange }) => {
  const [activePage, setActivePage] = useState(1);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (page) => {
    setActivePage(page);
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md   bg-primary px-4 py-2 text-sm font-medium text-text hover:bg-accent"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md   bg-primary px-4 py-2 text-sm font-medium text-text hover:bg-accent"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">97</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-primary"
            aria-label="Pagination"
          >
            <a
              href="#"
              onClick={() =>
                handlePageChange(activePage === 1 ? activePage : activePage - 1)
              }
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text ring-1 ring-inset ring-background hover:bg-accent focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </a>
            {pages.map((page) => (
              <a
                key={page}
                href="#"
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === activePage
                    ? "bg-variant-600 text-white"
                    : "text-text ring-1 ring-inset ring-background hover:bg-accent focus:z-20 focus:outline-offset-0"
                }`}
              >
                {page}
              </a>
            ))}
            <a
              href="#"
              onClick={() =>
                handlePageChange(
                  activePage === totalPages ? activePage : activePage + 1
                )
              }
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text ring-1 ring-inset ring-background hover:bg-accent focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
