import {EventEmitter} from 'events';

class Modal extends EventEmitter {
    /**
     * @type {object[]}
     */
    modals = [];

    /**
     * @method open
     * @param {object} data
     * @emits Modal#open
     */
    open = (data = {}) => {
        this.modals.push({data});
        this.emit('open');
    }
}

export default new Modal();
