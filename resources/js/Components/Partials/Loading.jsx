import React from 'react';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

/**
 * @function Loading
 * @return {*}
 * @constructor
 */
const Loading = () => {
    return (
        <div className="flex justify-center align-center py-10 w-full">
            <FontAwesomeIcon
                icon={faSpinner}
                spin
                size="5x"
                className="fill-current mr-1"
            />
        </div>
    );
};

export default Loading;
