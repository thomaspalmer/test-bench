import React from 'react'

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton} from 'Components/Button';

export default class AdminDisplayImportErrorsModal extends React.Component  {
    render() {
        const {import_data} = this.props;

        return (
            <Modal>
                <ModalBody>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="my-2 text-center black text-2xl leading-9 font-extrabold">
                            Import Errors
                        </h2>

                        <div className="text-center mt-4">
                            <table className="table-fixed">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Row</th>
                                        <th className="px-4 py-2">Column</th>
                                        <th className="px-4 py-2">Errors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {import_data.errors && import_data.errors.map((error, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className="border px-4 py-2">
                                                    {error.row}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {error.attribute}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {error.errors && error.errors.map((error2, i) => {
                                                        return (
                                                            <p>{error2}</p>
                                                        );
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter alignment="center">
                    <PrimaryButton className="mr-2" text="Close" onClick={this.props.onClose} />
                </ModalFooter>
            </Modal>
        )
    }
}
