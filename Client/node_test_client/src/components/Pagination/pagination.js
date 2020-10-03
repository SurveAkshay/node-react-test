import React from 'react';
import './pagination.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav className='Page navigation'>
        <ul className='pagination justify-content-center'>
            <li className={`page-item mr-1 ${currentPage == 1 ? 'd-none': ''}`}>
                <button type="button" onClick={() => paginate(currentPage - 1)} className={`btn btn-outline-dark ${currentPage == 1 ? 'disabled': ''}`}>Previous</button>
            </li>
            {pageNumbers.map(number => (
                <li key={number} className={`page-item rounded mr-1 ${currentPage == number ? 'bg-dark text-white': ''}`}>
                    <button onClick={() => paginate(number)} type="button" className={`btn rounded ${currentPage == number ? 'text-white' : 'btn-outline-dark'}`}>
                        {number}
                    </button>
                </li>
            ))}
            <li className={`page-item mr-1 ${currentPage == pageNumbers.length ? 'd-none': ''}`}>
                <button type="button" onClick={() => paginate(currentPage + 1)} className={`btn btn-outline-dark ${currentPage == pageNumbers.length ? 'disabled': ''}`}>Next</button>
            </li>
        </ul>
      </nav>
    );
  };
  
  export default Pagination;