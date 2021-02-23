import React from 'react';

import Label from './Label';

/**
 * @function Textarea
 * @param {string} containerClassName
 * @param {string} label
 * @param {string} placeholder
 * @param {string} id
 * @param {function} onChange
 * @param {*} value
 * @return {JSX.Element}
 * @constructor
 */
const Textarea = ({containerClassName, label, placeholder, id, onChange, value}) => {
    return (
        <div className={containerClassName}>
            {label && (<Label label={label} htmlFor={id} />)}

            <textarea
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
                    mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none
                    focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm
                "
            />
        </div>
    )
};

export default Textarea;
