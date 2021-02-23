import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

/**
 * @function Base
 * @param {function} onClick
 * @param {string} className
 * @param {string} text
 * @param {boolean} working
 * @param {boolean} disabled
 * @return {JSX.Element}
 * @constructor
 */
const Base = ({onClick, className, text, working, disabled}) => {
    return (
        <button
            className={className}
            type={onClick !== undefined ? 'button' : 'submit'}
            onClick={onClick}
            disabled={disabled}
        >
            {working && (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
            )}
            {text}
        </button>
    )
};

export default Base;
