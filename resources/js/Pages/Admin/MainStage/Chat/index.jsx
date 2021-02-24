import React from 'react';
import TimeAgo from 'react-timeago';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

import AdminLayout from 'Pages/Admin/AdminLayout';

import {Loading} from 'Components/Partials';
import {ModalTrigger} from 'Components/Modal';
import Delete from 'Components/Partials/Modals/Delete';

import ChatApi from 'Services/Api/Admin/MainStage/Chat';
import {Socket, Toast, User} from 'Services';
import {getAvatarUrl} from 'Services/Helpers';

export default class Chat extends React.Component {
    /**
     * @method state
     * @type {{meta: null, messages: [], working: boolean, sessionId: *}}
     */
    state = {
        messages: [],
        meta: null,
        working: false,
        sessionId: this.props.match.params.session
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchMessages();

        Socket.getConnection()
            .private(`chat.${this.state.sessionId}`)
            .listen('MainStageChat', (e) => {
                if (e.message.user_id !== User.id) {
                    this.handleAddMessage(e.message);
                }
            })
            .listen('subscription_error', console.error);

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
            this.fetchMessages();
        }
    };

    /**
     * @method fetchMessages
     * @return {Promise<void>}
     */
    fetchMessages = async () => {
        if (this.state.working || (this.state.meta !== null && this.state.meta?.current_page === this.state.meta?.last_page)) {
            return;
        }

        this.setState({working: true});

        const request = await ChatApi.get({
            session: this.state.sessionId
        }, {
            page: (this.state.meta?.current_page ?? 0) + 1
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
     * @method
     * @param {object} message
     * @returns {Promise<void>}
     */
    handleDelete = async (message) => {
        const request = await ChatApi.delete({
            session: this.state.sessionId,
            chat: message.id
        });

        if (request.success) {
            Toast.success('Message has been deleted');

            return this.setState({
                messages: this.state.messages.filter(m => m.id !== message.id)
            });
        }

        Toast.error();
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
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
     * @method renderMessage
     * @param {object} message
     * @return {JSX.Element}
     */
    renderMessage = (message) => {
        // TODO Show delete icon only if the user has the correct scope

        return (
            <div className="bg-ve-blue-5 bg-opacity-20 bg-gray-300 rounded-md p-3 mb-2 flex relative" key={message.id}>
                {this.renderDeleteButton(message)}

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

    /**
     * @method renderDeleteButton
     * @param {object} message
     * @return {JSX.Element}
     */
    renderDeleteButton = (message) => {
        return (
            <ModalTrigger
                component={Delete}
                props={{
                    onDelete: () => this.handleDelete(message),
                    itemName: 'Message'
                }}
            >
                <button className="absolute -right-4 -top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md transition duration-200 transform hover:scale-110">
                    <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                </button>
            </ModalTrigger>
        )
    }
}
