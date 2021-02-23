import React from 'react';

/**
 * @function ModalBody
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
const ModalBody = (props) => {
    return (
        <div className="px-4 py-5 sm:p-6">
            {props.children}
        </div>
    );
};


export default ModalBody;
