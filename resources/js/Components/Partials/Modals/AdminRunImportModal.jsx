import React from 'react'

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton, DangerButton, SecondaryButton} from 'Components/Button';
import {Loading, Alert} from 'Components/Partials';

import AdminImportsApi from 'Services/Api/Admin/Imports';

export default class AdminRunImportModal extends React.Component  {
    state = {
        alert: null,
        working: false,
        file: false,
        showTemplate: false,
    };

    /**
     * @var inputRef
     * @type {null|HTMLInputElement}
     */
    inputRef = null;

    /**
     * @method handleOpenInput
     */
    handleOpenInput = () => {
        this.inputRef.click();
    };

    handleSubmit = async () => {
        this.setState({
            alert: null,
            working: true
        });

        const response = await AdminImportsApi.storeImport({
            type: this.props.selectedImport.import,
            file: this.state.file,
        });

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
        const {alert, working, file, showTemplate} = this.state;
        const {selectedImport} = this.props;

        return (
            <Modal>
                <ModalBody>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="my-2 text-center black text-2xl leading-9 font-extrabold">
                            {/* https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters */}
                            { "Run " + selectedImport.import.replace(/([A-Z])/g, ' $1').trim() + " Import" }
                        </h2>

                        {alert !== null && (<Alert {...alert} />)}

                        { selectedImport.available_columns && 
                            <div className="text-center my-4 p-2">
                                <PrimaryButton
                                    text={(showTemplate ? "Hide" : "Show") + " Template"}
                                    onClick={() => this.setState({showTemplate: !showTemplate})}
                                />

                                { showTemplate && 
                                    <table className="table-fixed mx-auto mt-2">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">Columns</th>
                                                <th className="px-4 py-2">Rules</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(selectedImport.available_columns).map((column, i) => {
                                                return (
                                                    <tr key={i}>
                                                    <td className="px-4 py-2 border">{column[0]}</td>
                                                    <td className="px-4 py-2 border">{column[1]}</td>
                                                    </tr>
                                                ); 
                                            })}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        }

                        <div className="text-center mt-4">
                            <input
                                onChange={(e) => {
                                    const f = e.target.files.length > 0 ? e.target.files[0] : null;
                                    this.setState({ file: f });
                                }}
                                ref={ref => this.inputRef = ref}
                                type="file"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                            />

                            <SecondaryButton
                                text="Select file"
                                onClick={this.handleOpenInput}
                            />

                            { file &&
                                <p className="mt-4">
                                    {file.name}
                                </p>
                            }
                        </div>
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
