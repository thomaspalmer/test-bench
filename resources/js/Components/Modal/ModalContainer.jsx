import React from 'react';
import Modal from 'Services/Modal';

export default class Container extends React.Component {
    state = {
        modal: null,
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        Modal.on('open', this.checkModals);

        this.checkModals();
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        Modal.removeListener('open', this.checkModals);
    };

    /**
     * @method checkModals
     */
    checkModals = () => {
        if (Modal.modals.length === 0 || this.state.modal !== null) {
            return;
        }

        const {data} = Modal.modals[0];

        this.setState({
            modal: data,
        });

        Modal.modals.splice(0, 1);
    };

    /**
     * @method handleClose
     */
    handleClose = () => {
        this.setState({
            modal: null,
        }, this.checkModals);
    };

    /**
     * @method renderModals
     * @param {{}} modal
     * @return {*}
     */
    renderModals = (modal) => {
        if (modal.component) {
            return (
                <modal.component
                    {...modal.props}
                    onClose={() => this.handleClose()}
                />
            );
        }
    };

    /**
     * @method render
     * @return {null|*}
     */
    render = () => {
        const {modal} = this.state;

        if (modal === null) {
            return null;
        }

        return (
            <div
                className={
                    'modal fixed w-full h-full top-0 left-0 flex items-center ' +
                    'justify-center z-50'
                }>
                <div className={
                    'modal-overlay absolute w-full h-full bg-gray-900 opacity-50'
                }></div>

                {this.renderModals(modal)}
            </div>
        );
    }
}
