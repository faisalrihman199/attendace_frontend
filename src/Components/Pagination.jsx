import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const isActive = currentPage === i;
      pages.push(
        <li key={i} className="page-item mx-1">
          <button
            onClick={() => handlePageClick(i)}
            className={`page-link ${isActive ? 'active rounded-circle' : 'custom-page-link'}`}
            disabled={isActive}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    totalPages > 1 && (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mb-0">
          {/* First Page Button */}
          {currentPage > 3 && (
            <li className="page-item mx-1">
              <button
                onClick={() => handlePageClick(1)}
                className="page-link custom-page-link"
                
              >
                &laquo;
              </button>
            </li>
          )}

          {/* Previous Button */}
          <li className="page-item mx-1">
            <button
              onClick={handlePrevious}
              className={`page-link custom-page-link ${currentPage === 1 ? 'd-none' : 'd-block'}`}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next Button */}
          <li className="page-item mx-1">
            <button
              onClick={handleNext}
              className={`page-link custom-page-link ${currentPage === totalPages ? 'd-none' : 'd-block'}`}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </li>

          {/* Last Page Button */}
          {currentPage < totalPages - 2 && (
            <li className="page-item mx-1">
              <button
                onClick={() => handlePageClick(totalPages)}
                className="page-link custom-page-link"
              >
                &raquo;
              </button>
            </li>
          )}
        </ul>
      </nav>
    )
  );
};

export default Pagination;
