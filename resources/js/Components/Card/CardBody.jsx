import React from 'react';

/**
 * @function CardBody
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const CardBody = ({children}) => {
    return (
        <div className="px-4 py-5 sm:p-6">
            {children}
        </div>
    );
}

export default CardBody;
