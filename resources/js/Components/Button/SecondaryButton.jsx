import React from 'react';

import Base from './Base';

/**
 * @function SecondaryButton
 * @param {function} onClick
 * @param {string} className
 * @param {string} text
 * @param {boolean} working
 * @param {boolean} disabled
 * @return {JSX.Element}
 * @constructor
 */
const SecondaryButton = ({onClick, className, text, working, disabled}) => {
    const classes = `
        inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md
        text-white bg-gray-600 transition duration-150 ease-in-out flex items-center
        ${!disabled && !working ?
        'hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700' :
        'opacity-50'
    }
        ${className}
    `;

    return (
        <Base
            className={classes}
            type={onClick !== undefined ? 'button' : 'submit'}
            onClick={onClick}
            disabled={disabled}
            working={working}
            text={text}
        />
    );
};

export default SecondaryButton;
