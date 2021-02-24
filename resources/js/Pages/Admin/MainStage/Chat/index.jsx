import React from 'react';

import AdminLayout from 'Pages/Admin/AdminLayout';

import {Loading} from 'Components/Partials';

import ChatApi from 'Services/Api/Admin/MainStage/Chat';
import {Toast} from 'Services';

export default class Chat extends React.Component {
    state = {
        chat: [],
        chatMeta: null,
        working: false,
        sessionId: this.props.match.params.session
    };

    componentDidMount = () => {
        this.fetchChat();
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
                chat: [
                    ...this.state.chat,
                    ...request.data.data
                ],
                chatMeta: request.data.meta,
                working: false
            });
        }

        Toast.error();
        this.setState({working: false});
    };

    render () {
        const {working, chat} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Main Stage - Chat
                        </h2>
                    </div>

                    <div className="p-6">
                        {chat.map(this.renderChart)}

                        {working && (
                            <Loading />
                        )}
                    </div>

                </div>
            </AdminLayout>
        );
    }

    renderChart = (message) => {
        return (
            <div>

            </div>
        );
    };
}
