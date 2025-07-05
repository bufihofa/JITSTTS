import type React from "react";
import './Pagination.css';
interface PaginationProps {
  pagination: any;
  gotoPage: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ pagination, gotoPage }) => {
    let startPage = Math.max(1, pagination.page - 2);
    let endPage = Math.min(pagination.totalPages, pagination.page + 2);
    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(5, pagination.totalPages);
      } else if (endPage === pagination.totalPages) {
        startPage = Math.max(1, pagination.totalPages - 4);
      }
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return (
        <>
            <button className="page-button" onClick={() => gotoPage(pagination.page - 1)} disabled={!pagination.hasPrevious}>❮</button>
            {pages.map(page => (
                <button 
                    key={page}
                    className={`page-button ${pagination.page === page ? 'active-page' : ''}`}
                    disabled={pagination.page === page}
                    onClick={() => gotoPage(page)}
                >
                    {page}
                </button>
            ))}
            <button className="page-button" onClick={() => gotoPage(pagination.page + 1)} disabled={!pagination.hasMore}>❯</button>
        </>
    )
}
export default Pagination;