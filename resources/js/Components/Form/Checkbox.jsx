import React from 'react';

import Label from './Label';

/**
 * @function Checkbox
 * @param {string} labelPlacement
 * @param {string} containerClassName
 * @param {string} label
 * @param {string} id
 * @param {function} onChange
 * @param {*} value
 * @return {JSX.Element}
 * @constructor
 */
const Checkbox = ({labelPlacement = 'left', containerClassName, label, id, onChange, value}) => {
    return (
        <div className={`${containerClassName} flex items-center`}>
            {(labelPlacement === 'left') && label && (<Label label={label} htmlFor={id} className="mb-0 mr-4" />)}

            <input
                type="checkbox"
                id={id}
                checked={value}
                onChange={onChange}
                className="
                    h-4 w-4 text-indigo-600 transition duration-150 ease-in-out appearance-none rounded-md
                    border-gray-500 border hover:border-gray-600 focus:border-indigo-500
                "
            />

            {(labelPlacement === 'right') && label && (<Label label={label} htmlFor={id} className="mb-0 ml-4" />)}
        </div>
    )
};

export default Checkbox;
