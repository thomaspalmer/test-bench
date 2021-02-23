import React from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton, DangerButton} from 'Components/Button';

export default class Delete extends React.Component {
    /**
     * @method handleDelete
     * @return {Promise<void>}
     */
    handleDelete = async () => {
        await this.props.onDelete();
        this.props.onClose();
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {title, message} = this.props;

        return (
            <Modal>
                <ModalHeader onClose={this.props.onClose}>
                    {title ?? 'Are you sure?'}
                </ModalHeader>

                <ModalBody>
                    <p className="text-center">
                        {message ?? 'Are you sure you want to delete this ' + (this.props.itemName ?? 'item') + '?'}
                    </p>
                </ModalBody>

                <ModalFooter alignment="center">
                    <PrimaryButton className="mr-2" text="Cancel" onClick={this.props.onClose} />
                    <DangerButton onClick={this.handleDelete} text="Continue" />
                </ModalFooter>
            </Modal>
        )
    }
};
