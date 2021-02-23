import React from 'react';

/**
 * @function Card
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const Card = ({children}) => {
    return (
        <div className="bg-white overflow-hidden rounded-md sm:shadow w-full">
            {children}
        </div>
    );
}

export default Card;
