import React from 'react';
import ReactPaginate from 'react-paginate';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export default class Pagination extends React.Component {
    /**
     * @method handlePageChange
     * @param {object} page
     */
    handlePageChange = (page) => {
        // React pagination starts from 0 instead of 1, increment by 1
        this.props.goToPage(page.selected + 1);
    };

    /**
     * @method render
     * @return {*}
     */
    render = () => {
        const liClasses = '-ml-px inline-flex';
        const disabledClasses = 'opacity-50';
        const aClasses = 'px-4 py-2 border border-gray-300 bg-white text-sm ' +
            'leading-5 font-medium focus:outline-none active:text-gray-700' +
            'transition ease-in-out duration-150 hover:opacity-75';
        const activeLinkClass = 'bg-blue-600 text-white border-blue-600';

        return <div className={`${this.props.className}`}>
            <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft}/>}
                nextLabel={<FontAwesomeIcon icon={faChevronRight}/>}
                forcePage={this.props.page - 1}
                onPageChange={this.handlePageChange}
                pageCount={this.props.pageCount}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageClassName={liClasses}
                previousClassName={liClasses}
                breakClassName={liClasses}
                nextClassName={liClasses}
                disabledClassName={disabledClasses}
                pageLinkClassName={aClasses}
                breakLinkClassName={aClasses}
                previousLinkClassName={`${aClasses} rounded-l-md`}
                nextLinkClassName={`${aClasses} rounded-r-md`}
                activeLinkClassName={activeLinkClass}
            />
        </div>;
    };
}
