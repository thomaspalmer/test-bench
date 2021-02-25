import React from 'react';

import {Modal, ModalHeader, ModalBody} from 'Components/Modal';
import {Loading} from 'Components/Partials';

import RemoteConnections from 'Services/Api/MainStage/RemoteConnections';
import {Toast} from 'Services';

export default class RemoteControlConnect extends React.Component {
    timerInterval = null;

    state = {
        working: false,
        timeLeft: 30
    };

    componentDidMount = () => {
        this.fetchCode();
    };

    fetchCode = async () => {
        this.setState({working: true});

        const request = await RemoteConnections.get({
            session: this.props.sessionId
        });

        if (request.success) {
            return this.setState({
                timeLeft: 30,
                svg: null,
                working: false
            }, () => {
                this.timerInterval = setInterval(this.timer, 1000);
            });
        }

        Toast.error();
    };

    timer = () => {
        this.setState({
            timeLeft: this.state.timeLeft - 1
        }, () => {
            if (this.state.timeLeft === 0) {
                window.clearInterval(this.timerInterval);

                this.fetchCode();
            }
        });
    }

    render () {
        const {timeLeft, working} = this.state;

        return (
            <Modal>
                <ModalHeader onClose={this.props.onClose}>
                    Connect your Remote Control
                </ModalHeader>

                {working && (
                    <ModalBody>
                        <Loading />
                    </ModalBody>
                )}

                {!working && (
                    <ModalBody>
                        <div className="text-center">
                            <p className="mb-2">Scan the QR Code below to open this link.</p>

                            <p>This code will expire in {timeLeft}s</p>
                        </div>


                    </ModalBody>
                )}
            </Modal>
        )
    }
}

