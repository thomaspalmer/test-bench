import React from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import Label from './Label';

/**
 * @function Toggle
 * @param {*} value
 * @param {string} label
 * @param {string} containerClassName
 * @param {string} id
 * @param {boolean} disabled
 * @param {function} onChange
 * @param {string} labelPlacement
 * @return {JSX.Element}
 * @constructor
 */
const Toggle = ({value, label, containerClassName, id, disabled, onChange, labelPlacement = 'left'}) => {
    return (
        <div className={`${containerClassName} ${labelPlacement !== 'top' ? 'flex items-center' : ''} ${onChange && !disabled ? 'cursor-pointer' : ''}`} onClick={() => {
                if (!disabled) {
                    onChange(!value)
                }
            }}>

            {(labelPlacement === 'left' || labelPlacement === 'top') && label && (
                <React.Fragment>
                    <Label label={label} htmlFor={id} className={`mb-0 ${labelPlacement === 'left' ? 'mr-4' : ''}`} />
                </React.Fragment>
            )}

            <span
                role="checkbox" tabIndex="0" aria-checked="false"
                className={
                    'relative inline-block flex-shrink-0 h-6 w-11 ' +
                    'rounded-full border-2 border-transparent ' +
                    'cursor-pointer transition-colors ease-in-out ' +
                    'duration-200 focus:outline-none focus:shadow-outline ' +
                    `${value ? 'bg-indigo-600' : 'bg-gray-200'}` +
                    `${!value ? ' opacity-50' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} `
                }>
                <span
                    className={
                        'translate-x-0 relative inline-block h-5 w-5 ' +
                        'rounded-full bg-white shadow transform ' +
                        'transition ease-in-out duration-200 ' +
                        `${value ? 'translate-x-5' : 'translate-x-0'} `
                    }>
                    <span
                        className={
                            'ease-in duration-200 absolute ' +
                            'inset-0 h-full w-full flex items-center ' +
                            'justify-center transition-opacity ' +
                            `${value ? 'opacity-0' : 'opacity-100'}`
                        }>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={
                              'h-3 w-3 text-gray-400'
                            } />
                    </span>
                    <span
                        className={
                            'ease-out duration-100 absolute ' +
                            'inset-0 h-full w-full flex items-center ' +
                            'justify-center transition-opacity ' +
                            `${!value ? 'opacity-0' : 'opacity-100'}`
                        }>
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={
                              'h-3 w-3 text-gray-400'
                            }
                        />
                    </span>
                </span>
            </span>

            {(labelPlacement === 'right') && label && (<Label label={label} htmlFor={id} className="mb-0 ml-4" />)}
        </div>
    );
};

export default Toggle;
