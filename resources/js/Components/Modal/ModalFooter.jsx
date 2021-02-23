import React from 'react';

/**
 * @function ModalFooter
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
const ModalFooter = (props) => {
    let classes = '';

    switch (props.alignment) {
        case 'center':
            classes = 'flex justify-center';
            break;
        case 'between':
            classes = 'flex justify-between';
            break;
        case 'right':
            classes = 'flex justify-end';
            break;
    }

    return (
        <div className={`bg-gray-200 bg-opacity-50 px-4 py-3 sm:px-6 ${classes}`}>
            {props.children}
        </div>
    );
};

export default ModalFooter;
