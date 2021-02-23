import React from 'react';

/**
 * @function CardHeader
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const CardHeader = ({children}) => {
    return (
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
                {children}
            </h3>
        </div>
    );
}

export default CardHeader;
