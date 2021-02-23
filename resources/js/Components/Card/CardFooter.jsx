import React from 'react';

/**
 * @function CardFooter
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const CardFooter = ({children}) => {
    return (
        <div className="px-4 py-5 border-t border-gray-200 bg-gray-100 bg-opacity-50 sm:px-6">
            {children}
        </div>
    );
}

export default CardFooter;
