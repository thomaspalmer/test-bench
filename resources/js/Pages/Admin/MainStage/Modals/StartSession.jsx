import React from 'react';
import DateTime from 'luxon/src/datetime';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton, DangerButton} from 'Components/Button';

import Sessions from 'Services/Api/Admin/MainStage/Sessions';
import {Toast} from 'Services';

export default class StartSession extends React.Component {
    /**
     * @var state
     * @type {{working: boolean}}
     */
    state = {
        working: false
    };

    /**
     * @method handleStart
     * @return {Promise<void>}
     */
    handleStart = async () => {
        this.setState({working: true});
        const {session} = this.props;

        const request = await Sessions.patch({
            session: session.id
        }, {
            ...session,
            starts_at: DateTime.now()
        }, 'update');

        if (request.success) {
            Toast.success('Session has been started');
            return this.props.onClose();
        }

        Toast.error('Unable to start session, make sure there is not another session currently live');
        this.setState({working: false});
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {working} = this.state;

        return (
            <Modal>
                <ModalHeader onClose={this.props.onClose}>
                    Start Session
                </ModalHeader>

                <ModalBody>
                    <p className="text-center">
                        Are you sure you want to start this session?
                    </p>
                </ModalBody>

                <ModalFooter alignment="center">
                    <PrimaryButton text="Cancel" working={working} onClick={this.props.onClose} className="mr-2" />
                    <DangerButton text="Continue" working={working} onClick={this.handleStart} />
                </ModalFooter>
            </Modal>
        );
    }
}
