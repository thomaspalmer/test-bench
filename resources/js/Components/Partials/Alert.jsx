import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle, faCheckCircle, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';

export default class Alert extends React.Component {
    /**
     * @method render
     * @return {*}
     */
    render = () => {
        const {type, message, errors} = this.props;

        switch (type) {
            case 'error':
                return this.renderError(message, errors);
            case 'warning':
                return this.renderWarning(message, errors);
            case 'success':
            default:
                return this.renderSuccess(message);
        }
    };

    /**
     * @method renderSuccess
     * @param {string} message
     * @return {*}
     */
    renderSuccess = (message) => {
        return (
            <div className="rounded-md bg-green-300 bg-opacity-25 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0 text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} size="lg" color=""/>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm leading-5 font-medium text-green-800">
                            {message}
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * @method renderWarning
     * @param {string} message
     * @return {*}
     */
    renderWarning = (message) => {
        return (
            <div className="rounded-md bg-yellow-300 bg-opacity-25 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0 text-yellow-400">
                        <FontAwesomeIcon icon={faExclamationCircle} size="lg" color=""/>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm leading-5 font-medium text-yellow-800">
                            {message}
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * @method renderError
     * @param {string} message
     * @param {string[]} errors
     * @return {*}
     */
    renderError = (message, errors) => {
        message = message !== undefined ? message :
            'Sorry, your submission was invalid. Please try again';

        return (
            <div className="rounded-md bg-red-300 bg-opacity-25 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0 text-red-400">
                        <FontAwesomeIcon icon={faTimesCircle} size="lg" color=""/>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm leading-5 font-medium text-red-800">
                            {message}
                        </h3>
                        <div className="mt-1 text-sm leading-5 text-red-700">
                            <ul className="list-disc pl-5">
                                {errors !== undefined && errors.map((error, key) => (
                                    <li key={key} className="mt-1">
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}


