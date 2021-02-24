import React from 'react';
import {Link} from 'react-router-dom';

import AdminLayout from 'Pages/Admin/AdminLayout';
import {Loading} from 'Components/Partials';
import {PrimaryButton, SecondaryButton, DangerButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';
import Delete from 'Components/Partials/Modals/Delete';

import PollsApi from 'Services/Api/Admin/MainStage/Polls';
import {Toast} from 'Services';

export default class Polls extends React.Component {
    /**
     * @var state
     * @type {{polls: null, working: boolean}}
     */
    state = {
        working: false,
        polls: null,
        sessionId: this.props.match.params.session
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchPolls();
    };

    /**
     * @method fetchPolls
     * @param {number} page
     * @return {Promise<void>}
     */
    fetchPolls = async (page = 1) => {
        this.setState({working: true});

        const request = await PollsApi.get({
            session: this.state.sessionId
        }, {
            page
        });

        if (request.success) {
            return this.setState({
                working: false,
                polls: request.data
            });
        }

        Toast.error();
    };

    /**
     * @method handleDelete
     * @param {object} poll
     * @return {Promise<*>}
     */
    handleDelete = async (poll) => {
        const request = await PollsApi.delete({
            session: this.state.sessionId,
            poll: poll.id
        });

        if (request.success) {
            this.fetchPolls(this.state.polls.meta.current_page);

            return Toast.success('Poll has been deleted successfully');
        }

        Toast.error();
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, sessionId, polls} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage - Polls
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <Link to={`/admin/main-stage/polls/${sessionId}/store`}>
                                <PrimaryButton
                                    text="Create"
                                />
                            </Link>
                        </div>

                        {working && (<Loading />)}

                        {!working && polls && (
                            <React.Fragment>
                                <table className="table-auto w-full">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Question</th>
                                        <th></th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {polls.meta.total === 0 && (
                                        <tr>
                                            <td colSpan={2} className="text-center">
                                                There are no polls to display
                                            </td>
                                        </tr>
                                    )}

                                    {polls.meta.total > 0 && (
                                        <React.Fragment>
                                            {polls.data.map(poll => (
                                                <tr key={poll.id}>
                                                    <td className="border px-4 py-2">
                                                        {poll.question}
                                                    </td>
                                                    <td className="border px-4 py-2 flex">
                                                        <Link to={`/admin/main-stage/polls/${poll.session_id}/store/${poll.id}`}>
                                                            <PrimaryButton text="Edit" className="mr-2" />
                                                        </Link>

                                                        <Link to={`/admin/main-stage/polls/${poll.id}`}>
                                                            <SecondaryButton text="Results" className="mr-2" />
                                                        </Link>

                                                        <ModalTrigger
                                                            component={Delete}
                                                            props={{
                                                                itemName: 'session',
                                                                onDelete: () => this.handleDelete(poll)
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
