import React from 'react';
import {Link} from "react-router-dom";

import AdminLayout from '../AdminLayout';
import {Alert, Loading, PaginationBar} from 'Components/Partials';
import {ModalTrigger} from 'Components/Modal';
import Delete from 'Components/Partials/Modals/Delete';
import {PrimaryButton, DangerButton} from 'Components/Button';

import AdminAgendaApi from 'Services/Api/Admin/Agenda';

class AgendaIndex extends React.Component {

    state = {
        working: true,
        alert: null,
        agendas: [],
    };

    componentDidMount() {
        this.loadAgendas();
    }

    loadAgendas = async (page = 1) => {
        this.setState({
            working: true,
            alert: null,
        });

        const response = await AdminAgendaApi.get(null, {page});

        this.setState({
            working: false,
            agendas: response.data,
        });
    }

    handleDelete = async (agenda) => {
        this.setState({ working: true });

        let data = {
            confirmed: true
        };

        const response = await AdminAgendaApi.delete(agenda.id, 'delete-agenda', 204, {data});

        if (response.status !== 204) {
            this.setState({
                alert: {
                    type: 'error',
                    message: response.message
                },
                working: false
            });
            return;
        }

        this.loadAgendas();
    }

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, alert, agendas} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Agenda
                        </h2>
                    </div>
                </div>

                <div className="ml-4 mr-4 mt-4">
                    <div>
                        <Link to={"/admin/agenda/store"}>
                            <PrimaryButton
                                text="Click here to add a new Agenda Item."
                            />
                        </Link>
                    </div>

                    <div className="mt-8">
                        {working && (<Loading />)}

                        {alert !== null && (<Alert {...alert} />)}

                        {!working &&
                            <>
                                { agendas?.meta?.total == 0 &&
                                    <p>Agenda Items will appear here.</p>
                                }

                                { agendas?.meta?.total != 0 &&
                                    <>
                                        <table className="table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">Title</th>
                                                    <th className="px-4 py-2">Start Date (UTC)</th>
                                                    <th className="px-4 py-2">Start Time (UTC)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { agendas.data.map((agenda, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="border px-4 py-2 text-center">{agenda.title}</td>
                                                            <td className="border px-4 py-2 text-center">{agenda.start_date}</td>
                                                            <td className="border px-4 py-2 text-center">{agenda.start_time}</td>
                                                            <td className="border px-4 py-2 text-center flex">
                                                                <Link to={"/admin/agenda/store/"+agenda.id}>
                                                                    <PrimaryButton
                                                                        text="Update"
                                                                        className="ml-2"
                                                                    />
                                                                </Link>

                                                                <ModalTrigger
                                                                    component={Delete}
                                                                    props={{
                                                                        message: `
                                                                            Are you sure you want to delete this agenda item?
                                                                            This action cannot be reversed.
                                                                            All user bookings will be deleted too.
                                                                            You can deactivate the item instead, to prevent it from displaying
                                                                            on the site but preserve any user bookings.
                                                                        `,
                                                                        onDelete: () => this.handleDelete(agenda)
                                                                    }}
                                                                >
                                                                    <DangerButton
                                                                        text="Delete"
                                                                        className="ml-2"
                                                                    />
                                                                </ModalTrigger>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {agendas && (
                                            <div className="mt-12 mb-4">
                                                <PaginationBar
                                                    total={agendas.meta.total}
                                                    pageCount={agendas.meta.last_page}
                                                    page={agendas.meta.current_page}
                                                    goToPage={this.loadAgendas}
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

export default AgendaIndex;
