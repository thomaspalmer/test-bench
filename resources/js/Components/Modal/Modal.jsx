import * as React from 'react';

/**
 * @function Modal
 * @param {object} props
 * @return {JSX.Element}
 * @constructor
 */
const Modal = (props) => {
    return (
        <div
            className={
                `modal-container bg-white w-full ${props.size ?? 'max-w-screen-sm'} mx-auto max-h-full overflow-y-scroll
         rounded shadow-lg z-50 overflow-y-visible`}
        >
            {props.children}
        </div>
    );
};

export default Modal;
