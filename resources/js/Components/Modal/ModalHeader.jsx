import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

/**
 * @param {object} props
 * @return {*}
 * @constructor
 */
const ModalHeader = (props) => {
    return (
        <div
            className="px-4 py-5 sm:p-6 border-b border-gray-50 flex justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
                {props.children}
            </h3>
            {props.onClose !== undefined && (
                <button onClick={props.onClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            )}
        </div>
    );
};

export default ModalHeader;
