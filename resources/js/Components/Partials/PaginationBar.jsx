import React from 'react';

import Pagination from './Pagination';

/**
 * @function PaginationBar
 * @param {Number} total
 * @param pageCount
 * @param page
 * @param className
 * @param goToPage
 * @return {JSX.Element}
 * @constructor
 */
const PaginationBar = ({total, pageCount, page, className, goToPage}) => {
    return (
        <div className="flex flex-col-reverse md:flex-row justify-between">
            <div className="text-sm leading-5 text-gray-700 mt-4 md:my-auto">
                {total} {`result${total > 1 ? 's' : ''}`} in {pageCount} page{pageCount > 1 ? 's' : ''}
            </div>

            <div>
                <Pagination
                    pageCount={pageCount}
                    page={page}
                    className={className}
                    goToPage={goToPage}
                />
            </div>
        </div>
    );
};

export default PaginationBar;
