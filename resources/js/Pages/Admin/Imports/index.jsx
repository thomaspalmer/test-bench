import React from 'react';

import AdminLayout from '../AdminLayout';
import {Loading, PaginationBar} from 'Components/Partials';
import {ModalTrigger} from 'Components/Modal';
import AdminRunImportModal from 'Components/Partials/Modals/AdminRunImportModal';
import AdminDisplayImportErrorsModal from 'Components/Partials/Modals/AdminDisplayImportErrorsModal';
import {PrimaryButton} from 'Components/Button';

import AdminImportsApi from 'Services/Api/Admin/Imports';

class ImportsIndex extends React.Component {

    state = {
        working: true,
        availableImports: null,
        selectedImport: null,
        imports: null,
    };

    componentDidMount = async () => {
        await this.getAvailableImports();
        this.loadImports();
    }

    getAvailableImports = async () => {
        const response = await AdminImportsApi.getAvailableImports();

        this.setState({
            availableImports: response.data,
        });
    }

    loadImports = async (page) => {
        this.setState({working: true});

        const response = await AdminImportsApi.getImports({page});

        this.setState({
            working: false,
            imports: response.data,
        });
    }

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() { 
        const {working, availableImports, selectedImport, imports} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Imports
                        </h2>
                    </div>
                </div>
                
                <div className="ml-4 mr-4 mt-4">
                    <div className="flex">
                        <select
                            className="block black form-select transition duration-150 ease-in-out sm:text-sm sm:leading-5 mr-2"
                            onChange={(e) => this.setState({ 
                                selectedImport: e.target.value === "" ? null : availableImports.filter(n => n.import === e.target.value)[0]
                            }) }
                            value={selectedImport ? selectedImport.import : ''}
                        >
                            <option value="">Select An Import ...</option>
                            { availableImports && availableImports.map((import_data, i) => {
                                return (
                                    <option value={import_data.import} key={i}>
                                        {import_data.import}
                                    </option>
                                ); 
                            })}
                        </select>

                        <ModalTrigger
                            disabled={selectedImport === null}
                            component={AdminRunImportModal} 
                            props={{
                                selectedImport: selectedImport,
                                callbackOnSubmit: this.loadImports,
                            }}
                        >
                            <PrimaryButton
                                text="Run Import"
                            />
                        </ModalTrigger>
                    </div>

                    <div className="mt-8">
                        {working && (<Loading />)}

                        {!working &&
                            <>
                                { imports?.meta?.total == 0 &&
                                    <p className="mb-4">Import results will appear here.</p>
                                }

                                { imports?.meta?.total != 0 &&
                                    <>
                                        <p className="font-semibold cursor-pointer mt-8 mb-6 text-center" onClick={() => this.loadImports(1) }>
                                            Click here to refresh this table.
                                        </p>

                                        <table className="table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">Type</th>
                                                    <th className="px-4 py-2">Status</th>
                                                    <th className="px-4 py-2">Errors</th>
                                                    <th className="px-4 py-2">Ran On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { imports.data.map((import_data, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            {/* https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters */}
                                                            <td className="border px-4 py-2">{import_data.type.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                            <td className="border px-4 py-2">
                                                                {import_data.completed &&
                                                                    <>Completed - {import_data.successful ? 'Successful' : 'Failed'}</>
                                                                }

                                                                {!import_data.completed &&
                                                                    <>Pending</>
                                                                }
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                {import_data.errors &&
                                                                    <ModalTrigger
                                                                        component={AdminDisplayImportErrorsModal} 
                                                                        props={{import_data}}
                                                                    >
                                                                        <PrimaryButton
                                                                            text="View"
                                                                        />
                                                                    </ModalTrigger>
                                                                }
                                                            </td>
                                                            <td className="border px-4 py-2">{import_data.created_at_human_readable}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {imports && (
                                            <div className="mt-12 mb-4">
                                                <PaginationBar
                                                    total={imports.meta.total}
                                                    pageCount={imports.meta.last_page}
                                                    page={imports.meta.current_page}
                                                    goToPage={this.loadImports}
                                                />
                                            </div>
                                        )}
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
            </AdminLayout>
        )
    }
}

export default ImportsIndex;
