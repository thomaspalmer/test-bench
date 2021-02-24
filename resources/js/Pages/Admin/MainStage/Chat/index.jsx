import React from 'react';

import AdminLayout from 'Pages/Admin/AdminLayout';

import {Loading} from 'Components/Partials';

import ChatApi from 'Services/Api/Admin/MainStage/Chat';
import {Socket, Toast, User} from 'Services';
import {getAvatarUrl} from 'Services/Helpers';
import TimeAgo from 'react-timeago';

export default class Chat extends React.Component {
    state = {
        messages: [],
        meta: null,
        working: false,
        sessionId: this.props.match.params.session
    };

    componentDidMount = () => {
        this.fetchChat();

        Socket.getConnection()
            .private(`chat.${this.state.sessionId}`)
            .listen('MainStageChat', (e) => {
                if (e.message.user_id !== User.id) {
                    this.handleAddMessage(e.message);
                }
            })
            .listen('subscription_error', console.error);
    };

    fetchChat = async (page = 1) => {
        this.setState({working: true});

        const request = await ChatApi.get({
            session: this.state.sessionId
        }, {
            page,
            search: this.state.search
        });

        if (request.success) {
            return this.setState({
                messages: [
                    ...this.state.messages,
                    ...request.data.data
                ],
                meta: request.data.meta,
                working: false
            });
        }

        Toast.error();
        this.setState({working: false});
    };

    render () {
        const {working, messages} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage - Chat
                        </h2>
                    </div>

                    <div className="p-6">
                        {messages.map(this.renderMessage)}

                        {working && (
                            <Loading />
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    /**
     * @method handleAddMessage
     * @param {object} message
     */
    handleAddMessage = (message) => {
        this.setState({
            messages: [
                ...[message],
                ...this.state.messages
            ]
        });
    };

    /**
     * @method renderMessage
     * @param {object} message
     * @return {JSX.Element}
     */
    renderMessage = (message) => {
        return (
            <div className="bg-ve-blue-5 bg-opacity-20 bg-gray-300 rounded-md p-3 mb-2 flex" key={message.id}>
                {window.base.features.avatar && (
                    <img
                        className="rounded-full h-8 w-8 mr-2"
                        src={getAvatarUrl(message.user)}
                        alt={message.user?.full_name}
                    />
                )}

                <div className="w-full">
                    <div className="text-md mb-1 leading-5">
                        {message.message.split('\n').map((item, key) => (
                            <p className="mb-1" key={key}>
                                {item}
                            </p>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs">
                        <span>{message.user.first_name} {message.user.last_name[0]}</span>
                        <span>
                            <TimeAgo date={message.created_at}/>
                        </span>
                    </div>
                </div>
            </div>
        );
    };
}
