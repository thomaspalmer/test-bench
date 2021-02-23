import React from 'react';

import Base from './Base';

/**
 * @function PrimaryButton
 * @param {function} onClick
 * @param {string} className
 * @param {string} text
 * @param {boolean} working
 * @param {boolean} disabled
 * @return {JSX.Element}
 * @constructor
 */
const PrimaryButton = ({onClick, className, text, working, disabled}) => {
    const classes = `
        bg-light-blue-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex
        justify-center items-center text-sm font-medium text-white
        ${!disabled && !working ?
            'hover:bg-light-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500' :
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

export default PrimaryButton;
