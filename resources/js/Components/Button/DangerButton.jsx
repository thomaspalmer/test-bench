import React from 'react';

import Base from './Base';

/**
 * @function DangerButton
 * @param {function} onClick
 * @param {string} type
 * @param {string} className
 * @param {string} text
 * @param {boolean} working
 * @param {boolean} disabled
 * @return {JSX.Element}
 * @constructor
 */
const DangerButton = ({onClick, type, className, text, working, disabled}) => {
    const classes = `
        inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md
        text-white bg-red-600 transition duration-150 ease-in-out flex items-center
        ${!disabled && !working ?
            'hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' :
            'opacity-50 cursor-default'
        }
        ${className}
    `;

    return (
        <Base
            className={classes}
            type={type}
            onClick={onClick}
            disabled={disabled}
            working={working}
            text={text}
        />
    );
};

export default DangerButton;
