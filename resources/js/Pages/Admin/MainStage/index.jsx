import React from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBroadcastTower} from '@fortawesome/free-solid-svg-icons';

import AdminLayout from 'Pages/Admin/AdminLayout';
import {Loading} from 'Components/Partials';
import {PrimaryButton, SecondaryButton, DangerButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';
import Delete from 'Components/Partials/Modals/Delete';

import {StartSession, EndSession} from './Modals';

import Sessions from 'Services/Api/Admin/MainStage/Sessions';
import {Toast} from 'Services';

export default class MainStage extends React.Component {
    /**
     * @var state
     * @type {{sessions: null, working: boolean}}
     */
    state = {
        working: false,
        sessions: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchSessions();

        Sessions.on('update', this.fetchSessions);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        Sessions.removeListener('update', this.fetchSessions);
    };

    /**
     * @method fetchSessions
     * @param {number} page
     * @return {Promise<void>}
     */
    fetchSessions = async (page = 1) => {
        this.setState({working: true});

        const request = await Sessions.get(null, {
            page
        });

        if (request.success) {
            return this.setState({
                working: false,
                sessions: request.data
            });
        }

        Toast.error();
    };

    /**
     * @method handleDelete
     * @param {object} session
     * @return {Promise<*>}
     */
    handleDelete = async (session) => {
        const request = await Sessions.delete({
            session
        });

        if (request.success) {
            this.fetchSessions(this.state.sessions.meta.current_page);

            return Toast.success('Session has been deleted successfully');
        }

        Toast.error();
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, sessions} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <Link to="/admin/main-stage/store">
                                <PrimaryButton
                                    text="Create"
                                />
                            </Link>
                        </div>

                        {working && (<Loading />)}

                        {!working && sessions && (
                            <React.Fragment>
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Title</th>
                                            <th className="px-4 py-2 text-left">Starts At</th>
                                            <th className="px-4 py-2 text-left">Ends At</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sessions.meta.total === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center">
                                                    There are no sessions to display
                                                </td>
                                            </tr>
                                        )}

                                        {sessions.meta.total > 0 && (
                                            <React.Fragment>
                                                {sessions.data.map(session => (
                                                    <tr key={session.id}>
                                                        <td className="border px-4 py-2">
                                                            {session.live && (
                                                                <FontAwesomeIcon icon={faBroadcastTower} className="mr-2 text-green-500" />
                                                            )}
                                                            {session.title}
                                                        </td>
                                                        <td className="border px-4 py-2">{session.starts_at_format ?? 'N/A'}</td>
                                                        <td className="border px-4 py-2">{session.ends_at_format ?? 'N/A'}</td>
                                                        <td className="border px-4 py-2 flex">
                                                            <Link to={`/admin/main-stage/store/${session.id}`}>
                                                                <PrimaryButton text="Edit" className="mr-2" />
                                                            </Link>

                                                            {!session.live && (
                                                                <ModalTrigger
                                                                    component={StartSession}
                                                                    props={{
                                                                        session
                                                                    }}
                                                                >
                                                                    <DangerButton text="Start" className="mr-2" />
                                                                </ModalTrigger>
                                                            )}

                                                            {session.live && (
                                                                <ModalTrigger
                                                                    component={EndSession}
                                                                    props={{
                                                                        session
                                                                    }}
                                                                >
                                                                    <DangerButton text="End" className="mr-2" />
                                                                </ModalTrigger>
                                                            )}

                                                            {session.chat && (
                                                                <Link to={`/admin/main-stage/chat/${session.id}`}>
                                                                    <SecondaryButton text="Chat" className="mr-2" />
                                                                </Link>
                                                            )}

                                                            {session.reactions && (
                                                                <Link to={`/admin/main-stage/reactions/${session.id}`}>
                                                                    <SecondaryButton text="Reactions" className="mr-2" />
                                                                </Link>
                                                            )}

                                                            <ModalTrigger
                                                                component={Delete}
                                                                props={{
                                                                    itemName: 'session',
                                                                    session,
                                                                    onDelete: () => this.handleDelete(session.id)
                                                                }}
                                                            >
                                                                <DangerButton text="Delete" />
                                                            </ModalTrigger>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        )}
                                    </tbody>
                                </table>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    }
}
