import React from 'react';
import QRCode from 'qrcode';

import {Modal, ModalHeader, ModalBody} from 'Components/Modal';
import {Loading} from 'Components/Partials';

import RemoteConnections from 'Services/Api/MainStage/RemoteConnections';
import {Toast} from 'Services';

export default class RemoteControlConnect extends React.Component {
    /**
     * @var timerInterval
     * @type {null}
     */
    timerInterval = null;

    /**
     * @var canvasRef
     * @type {HTMLCanvasElement}
     */
    canvasRef;

    state = {
        working: false,
        timeLeft: 30
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchCode();
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        window.clearInterval(this.timerInterval);
    };

    /**
     * @method fetchCode
     * @return {Promise<void>}
     */
    fetchCode = async () => {
        this.setState({working: true});

        const request = await RemoteConnections.get({
            session: this.props.sessionId
        });

        if (request.success) {
            const data = request.data.data;

            QRCode.toCanvas(this.canvasRef, data.url, (error) => {
                if (error) {
                    Toast.error();
                    return false;
                }
            });

            return this.setState({
                timeLeft: data.otp.expires,
                svg: null,
                working: false
            }, () => {
                this.timerInterval = setInterval(this.timer, 1000);
            });
        }

        Toast.error();
    };

    /**
     * @method timer
     */
    timer = () => {
        this.setState({
            timeLeft: this.state.timeLeft - 1
        }, () => {
            if (this.state.timeLeft === 0) {
                window.clearInterval(this.timerInterval);

                this.fetchCode();
            }
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {timeLeft, working} = this.state;

        return (
            <Modal>
                <ModalHeader onClose={this.props.onClose}>
                    Connect your Remote Control
                </ModalHeader>

                <ModalBody>
                    {working && (
                        <Loading/>
                    )}

                    <React.Fragment>
                        <div className="text-center">
                            <p className="mb-2">Scan the QR Code below to open this link.</p>

                            <p>This code will expire in {timeLeft}s</p>
                        </div>
                    </React.Fragment>

                    <canvas className="mx-auto" ref={ref => this.canvasRef = ref} />
                </ModalBody>
            </Modal>
        );
    }
}

