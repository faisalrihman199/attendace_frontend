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
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        // Loop through and display the pages in the calculated range
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className="page-item">
                    <button
                        onClick={() => handlePageClick(i)}
                        className={`page-link ${currentPage === i ? 'active' : ''}`}
                        disabled={currentPage === i} // Disable button for the current page
                    >
                        {i} {/* Display page number */}
                    </button>
                </li>
            );
        }
        return pages;
    };

    return (
        totalPages > 1 && (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    {/* First Page Button */}
                    {currentPage > 3 && (
                        <li className="page-item">
                            <button
                                onClick={() => handlePageClick(1)}
                                className="page-link"
                            >
                                &laquo; {/* First page arrow */}
                            </button>
                        </li>
                    )}

                    {/* Previous Button */}
                    <li className="page-item">
                        <button
                            onClick={handlePrevious}
                            className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
                            disabled={currentPage === 1} // Disable button if on the first page
                        >
                            &lt; {/* Previous arrow */}
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {renderPageNumbers()}

                    {/* Next Button */}
                    <li className="page-item">
                        <button
                            onClick={handleNext}
                            className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                            disabled={currentPage === totalPages} // Disable button if on the last page
                        >
                            &gt; {/* Next arrow */}
                        </button>
                    </li>

                    {/* Last Page Button */}
                    {currentPage < totalPages - 2 && (
                        <li className="page-item">
                            <button
                                onClick={() => handlePageClick(totalPages)}
                                className="page-link"
                            >
                                &raquo; {/* Last page arrow */}
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        )
    );
};

export default Pagination;
