import React from 'react';
import EventEmitter from 'events';
import {toast} from 'react-toastify';

import {Error, Success} from 'Components/Toast';

class Toast extends EventEmitter {
    /**
     * @method success
     * @param {string} body
     * @param {string|null} title
     */
    success = (body, title = null) => {
        toast(<Success body={body} title={title} />);

        this.emit('toast-open', {
            type: 'success'
        });
    };

    /**
     * @method error
     * @param {string|null} body
     * @param {string|null} title
     */
    error = (body = null, title = null) => {
        toast(<Error body={body} title={title} />);

        this.emit('toast-open', {
            type: 'success'
        });
    };
}

export default new Toast();
