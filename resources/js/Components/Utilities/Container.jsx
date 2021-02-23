import React from 'react';

/**
 * @function Container
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const Container = ({children}) => {
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
            {children}
        </div>
    );
}

export default Container;
