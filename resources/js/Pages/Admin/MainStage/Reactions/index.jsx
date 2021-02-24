import React from 'react';
import DateTime from 'luxon/src/datetime';

import AdminLayout from 'Pages/Admin/AdminLayout';

import {Loading} from 'Components/Partials';

import ReactionsApi from 'Services/Api/Admin/MainStage/Reactions';
import {Toast, Socket} from 'Services';

export default class Reactions extends React.Component {
    /**
     * @var state
     * @type {{meta: null, working: boolean, reactions: [], sessionId: *}}
     */
    state = {
        reactions: [],
        meta: null,
        working: false,
        sessionId: this.props.match.params.session
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchReactions();

        Socket.getConnection()
            .private(`reactions.${this.state.sessionId}`)
            .listen('Reaction', (e) => {
                this.setState({
                    reactions: [
                        ...[e.reaction],
                        ...this.state.reactions
                    ]
                });
            });

        document.addEventListener('scroll', this.loadMore);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        document.removeEventListener('scroll', this.loadMore);
    };

    /**
     * @method loadMore
     */
    loadMore = () => {
        const bottom = document.documentElement.scrollHeight - Math.ceil(document.documentElement.scrollTop) === document.documentElement.clientHeight;

        if (bottom) {
            this.fetchReactions();
        }
    };

    /**
     * @method fetchReactions
     * @return {Promise<void>}
     */
    fetchReactions = async () => {
        if (this.state.working || (this.state.meta !== null && this.state.meta?.current_page === this.state.meta?.last_page)) {
            return;
        }

        this.setState({working: true});

        const request = await ReactionsApi.get({
            session: this.state.sessionId
        }, {
            page: (this.state.meta?.current_page ?? 0) + 1
        });

        if (request.success) {
            return this.setState({
                reactions: [
                    ...this.state.reactions,
                    ...request.data.data
                ],
                meta: request.data.meta,
                working: false
            });
        }

        Toast.error();
        this.setState({working: false});
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {working, reactions} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage - Reactions
                        </h2>
                    </div>

                    <div className="p-6">
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">User</th>
                                    <th className="px-4 py-2 text-left">Reaction</th>
                                    <th className="px-4 py-2 text-left">Created At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reactions.length > 0 && (
                                    <React.Fragment>
                                        {reactions.map(reaction => (
                                            <tr key={reaction.id}>
                                                <td className="border px-4 py-2">{reaction.user.full_name}</td>
                                                <td className="border px-4 py-2">{reaction.reaction}</td>
                                                <td className="border px-4 py-2">{DateTime.fromISO(reaction.created_at).toLocaleString(DateTime.DATETIME_FULL)}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                )}
                                {reactions.length === 0 && (
                                    <tr>
                                        <td colSpan={3}>There is no data to show you</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {working && (
                            <Loading />
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    }
}
