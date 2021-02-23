import React from 'react'

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton, DangerButton} from 'Components/Button';
import {Loading, Alert} from 'Components/Partials';

import AdminReportsApi from 'Services/Api/Admin/Reports';

export default class AdminRunReportModal extends React.Component  {
    state = {
        alert: null,
        working: false,
    };

    handleSubmit = async () => {
        this.setState({
            alert: null,
            working: true
        });

        const response = await AdminReportsApi.storeReport(this.props.type);

        if (response.status !== 201) {
            this.setState({
                alert: {
                    type: 'error',
                    message: response.message,
                    errors: response.errors
                },
                working: false
            });
            return;
        }

        this.props.callbackOnSubmit(1);

        this.props.onClose();
    };

    render() {
        const {alert, working} = this.state;

        return (
            <Modal>
                <ModalBody>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="my-2 text-center black text-2xl leading-9 font-extrabold">
                            {/* https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters */}
                            { "Run " + this.props.type.replace(/([A-Z])/g, ' $1').trim() + " Report" }
                        </h2>

                        {alert !== null && (<Alert {...alert} />)}
                    </div>
                </ModalBody>

                <ModalFooter alignment="center">
                    {working && (<Loading color="text-black"/>)}

                    {!working &&
                        <div className="flex justify-around space-between">
                            <PrimaryButton className="mr-2" text="Cancel" onClick={this.props.onClose} />
                            <DangerButton onClick={this.handleSubmit} text="Run" />
                        </div>
                    }
                </ModalFooter>
            </Modal>
        )
    }
}
