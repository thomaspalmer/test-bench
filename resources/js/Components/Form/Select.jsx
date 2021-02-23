import React from 'react';
import ReactSelect from 'react-select';

import Label from './Label';

/**
 * @function select
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
const Select = (props) => {
    const {containerClassName, label, id, onChange, value, options} = props;
    let selectedValue = null;

    if (value && options) {
        if (props.isMulti) {
            selectedValue = options.filter(o => value.indexOf(o.value) !== -1);
        } else {
            const o = options.filter(o => value === o.value);

            if (o.length !== 0) {
                selectedValue = o[0];
            }
        }
    }

    return (
        <div className={containerClassName}>
            {label && (<Label label={label} htmlFor={id} />)}

            <ReactSelect
                {...props}
                value={selectedValue}
                options={options}
                onChange={(option) => onChange(option.value)}
                menuPosition="fixed"
            />

            {/*<select*/}
            {/*    id={id}*/}
            {/*    value={value ?? ''}*/}
            {/*    onChange={onChange}*/}
            {/*    className="*/}
            {/*        block border-gray-500 border w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5*/}
            {/*        bg-white rounded-md py-2 px-3 text-base leading-6 hover:border-gray-600*/}
            {/*        focus:border-indigo-500*/}
            {/*    "*/}
            {/*>*/}
            {/*    <option value=""></option>*/}
            {/*    {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}*/}
            {/*</select>*/}
        </div>
    )
};

export default Select;
