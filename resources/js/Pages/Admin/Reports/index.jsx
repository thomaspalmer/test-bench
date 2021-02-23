import React from 'react';
import Axios from 'axios';

import AdminLayout from '../AdminLayout';
import {Loading, PaginationBar} from 'Components/Partials';
import {ModalTrigger} from 'Components/Modal';
import AdminRunReportModal from 'Components/Partials/Modals/AdminRunReportModal';
import {PrimaryButton} from 'Components/Button';

import AdminReportsApi from 'Services/Api/Admin/Reports';

class ReportsIndex extends React.Component {

    state = {
        type: '',
        working: true,
        availableReports: null,
        reports: null,
    };

    componentDidMount = async () => {
        await this.getAvailableReports();
        this.loadReports();
    }

    getAvailableReports = async () => {
        const response = await AdminReportsApi.getAvailableReports();

        this.setState({
            availableReports: response.data,
        });
    }

    loadReports = async (page) => {
        this.setState({working: true});

        const response = await AdminReportsApi.getReports({page});

        this.setState({
            working: false,
            reports: response.data,
        });
    }

    downloadReport = async (report) => {
        // TODO use API service.

        Axios({
            url: `/api/v1/admin/reports/${report.id}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute('download', report.file_name);
            document.body.appendChild(fileLink);

            fileLink.click();
        });
    }

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() { 
        const {type, working, availableReports, reports} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Reports
                        </h2>
                    </div>
                </div>
                
                <div className="ml-4 mr-4 mt-4">
                    <div className="flex">
                        <select
                            className="block black form-select transition duration-150 ease-in-out sm:text-sm sm:leading-5 mr-2"
                            onChange={(e) => this.setState({ type: e.target.value }) }
                            value={type}
                        >
                            <option value="">Select A Report ...</option>
                            {/* https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters */}
                            { availableReports && availableReports.map((report, i) => {
                                return (
                                    <option value={report} key={i}>{report.replace(/([A-Z])/g, ' $1').trim()}</option>
                                ); 
                            })}
                        </select>

                        <ModalTrigger
                            disabled={type === null || type === ""}
                            component={AdminRunReportModal} 
                            props={{
                                type: type,
                                callbackOnSubmit: this.loadReports,
                            }}
                        >
                            <PrimaryButton
                                text="Run Report"
                            />
                        </ModalTrigger>
                    </div>

                    <div className="mt-8">
                        {working && (<Loading />)}

                        {!working &&
                            <>
                                { reports?.meta?.total == 0 &&
                                    <p className="mb-4">Reports will appear here.</p>
                                }

                                { reports?.meta?.total != 0 &&
                                    <>
                                        <p className="font-semibold cursor-pointer mt-8 mb-6 text-center" onClick={() => this.loadReports(1) }>
                                            Click here to refresh this table.
                                        </p>

                                        <table className="table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">Type</th>
                                                    <th className="px-4 py-2">Status</th>
                                                    <th className="px-4 py-2">Ran On</th>
                                                    <th className="px-4 py-2">Download</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { reports.data.map((report, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            {/* https://stackoverflow.com/questions/5582228/insert-space-before-capital-letters */}
                                                            <td className="border px-4 py-2">{report.type.replace(/([A-Z])/g, ' $1').trim()}</td>
                                                            <td className="border px-4 py-2">{report.completed ? 'Completed' : 'Pending'}</td>
                                                            <td className="border px-4 py-2">{report.created_at_human_readable}</td>
                                                            <td className="border px-4 py-2 text-center">
                                                                { report.completed === true &&
                                                                    <PrimaryButton
                                                                        onClick={() => { this.downloadReport(report) }}
                                                                        text="Download"
                                                                    />
                                                                }

                                                                { report.completed !== true &&
                                                                    <p>pending ...</p>
                                                                }
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {reports && (
                                            <div className="mt-12 mb-4">
                                                <PaginationBar
                                                    total={reports.meta.total}
                                                    pageCount={reports.meta.last_page}
                                                    page={reports.meta.current_page}
                                                    goToPage={this.loadReports}
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

export default ReportsIndex;
