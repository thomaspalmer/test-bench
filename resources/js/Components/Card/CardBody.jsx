import React from 'react';

/**
 * @function CardBody
 * @param {JSX.Element} children
 * @param {string} className
 * @return {JSX.Element}
 * @constructor
 */
const CardBody = ({children, className}) => {
    return (
        <div className={`px-4 py-5 sm:p-6 ${className}`}>
            {children}
        </div>
    );
}

export default CardBody;
