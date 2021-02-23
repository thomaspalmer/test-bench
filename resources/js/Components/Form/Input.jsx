import React from 'react';

import Label from './Label';

const Input = React.forwardRef(({containerClassName, type, label, placeholder, id, onChange, value, readOnly}, ref) => {
    return (
        <div className={containerClassName}>
            {label && (<Label label={label} htmlFor={id} />)}

            <input
                ref={ref}
                readOnly={readOnly}
                type={type}
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(type === 'file' ? e.target.files : e.target.value)}
                placeholder={placeholder}
                className="
                    mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none
                    focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm
                "
            />
        </div>
    );
});

export default Input;
