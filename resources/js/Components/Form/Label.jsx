import React from 'react';

/**
 * @function Label
 * @param {string} label
 * @param {string} htmlFor
 * @param {string} className
 * @return {JSX.Element}
 * @constructor
 */
const Label = ({label, htmlFor, className}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium leading-5 text-gray-700 mb-2 ${className}`}
        >
            {label}
        </label>
    )
};

export default Label;
