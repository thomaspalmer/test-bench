import React from 'react';

import AdminLayout from 'Pages/Admin/AdminLayout';

import {Loading} from 'Components/Partials';

import Poll from 'Services/Api/Admin/MainStage/Polls';

export default class Results extends React.Component {
    state = {
        sessionId: this.props.match.params.session,
        pollId: this.props.match.params?.poll
    };

    componentDidMount = () => {
        this.fetchPoll();
    };

    fetchPoll = async () => {
        this.setState({loading: true});

        const request = await Poll.get({
            session: this.state.sessionId,
            poll: this.state.pollId,
        });

        if (request.success) {
            this.setState({
                loading: false,
                poll: request.data.data
            });
        }
    };

    render () {
        const {loading, poll} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6 flex justify-between">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage - Poll - Results
                        </h2>

                        <button onClick={this.fetchPoll}>
                            Refresh
                        </button>
                    </div>

                    {loading && (
                        <div className="p-6">
                            <Loading />
                        </div>
                    )}

                    {!loading && poll && (
                        <div className="p-6">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Answer</th>
                                        <th className="border px-4 py-2 text-left">Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {poll.answers.map(a => (
                                    <tr key={a.id}>
                                        <th className="border px-4 py-2 text-left">{a.answer}</th>
                                        <td className="border px-4 py-2 text-left">
                                            {a.submission_count} - {Math.round((a.submission_count / poll.submission_count) * 100).toLocaleString(2)}%
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </AdminLayout>
        );
    }
}
