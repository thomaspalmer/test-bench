import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';

import CloseButton from './CloseButton';

/**
 * @function Error
 * @param {object} props
 * @return {*}
 * @constructor
 */
const Error = (props) => {
    const {title, body, closeToast} = props;

    return (
        <div className="p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 text-red-400">
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" color=""/>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm leading-5 font-medium text-gray-900">
                        {title ?? 'Error'}
                    </p>
                    <p className="mt-1 text-sm leading-5">{body ?? 'Sorry, there was a problem. Please try again.'}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className={
                            'inline-flex text-gray-400 focus:outline-none ' +
                            'transition ease-in-out duration-150'
                        }
                        onClick={closeToast}
                    >
                        <CloseButton/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Error;
