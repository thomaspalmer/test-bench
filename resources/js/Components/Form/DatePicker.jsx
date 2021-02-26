import React from 'react';
import DatePicker from 'react-datepicker';
import Label from 'Components/Form/Label';

/**
 * @param {string} containerClassName
 * @param {string} label
 * @param {string} id
 * @param {string} className
 * @param {*[]} rest
 * @return {JSX.Element}
 */
export default ({containerClassName, label, id, className, ...rest}) => {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (<Label label={label} htmlFor={id} />)}

            <DatePicker
                {...rest}
                className={`w-full border border-gray-300 rounded-l-md shadow-sm ${className}`}
            />
        </div>
    );
};
