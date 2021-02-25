import React from 'react';
import TimeAgo from 'react-timeago';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

import {FormHandler, Textarea} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Card, CardBody} from 'Components/Card';

import ChatApi from 'Services/Api/MainStage/Chat';

import {Toast, User, Socket} from 'Services';
import {getAvatarUrl} from 'Services/Helpers';

class Chat extends React.Component {
    /**
     * @var containerRef
     * @type {null|HTMLDivElement}
     */
    containerRef = null;

    /**
     * @var state
     * @type {{messages: [], meta: null, working: boolean}}
     */
    state = {
        working: false,
        messages: [],
        meta: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchMessages();

        this.containerRef.addEventListener('scroll', this.handleLoadMore);

        Socket.getConnection()
            .private(`main_stage_chat.${this.props.sessionId}`)
            .listen('MainStageChat', (e) => {
                if (e.message.user_id !== User.id) {
                    this.handleAddMessage(e.message);
                }
            })
            .listen('MainStageChatDeleted', (e) => {
                this.handleDeleteMessage(e.message);
            })
            .listen('subscription_error', console.error);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        this.containerRef.removeEventListener('scroll', this.handleLoadMore);
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
            session: this.props.sessionId
        }, {
            page: (this.state.meta?.current_page ?? 0) + 1
        });

        if (request.success) {
            return this.setState({
                messages: [...this.state.messages, ...request.data.data],
                meta: request.data.meta,
                working: false
            });
        }

        Toast.error();
    };

    /**
     * @methid handleLoadMore
     * @param {Event} e
     */
    handleLoadMore = (e) => {
        const bottom = e.target.scrollHeight - Math.ceil(e.target.scrollTop) === e.target.clientHeight;

        if (bottom) {
            this.fetchMessages();
        }
    };

    /**
     * @method request
     * @param {object} data
     * @return {Promise<*>}
     */
    request = (data) => {
        return ChatApi.post({
            session: this.props.sessionId
        }, {
            ...data,
            session_id: this.props.sessionId
        });
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
     * @method handleAddMessage
     * @param {object} message
     */
    handleDeleteMessage = (message) => {
        this.setState({
            messages: this.state.messages.filter(m => m.id !== message.id)
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {messages, working} = this.state;

        return (
            <Card className="h-full">
                <CardBody>
                    <div className="overflow-y-scroll max-h-96 overflow-y-auto" ref={ref => this.containerRef = ref}>
                        {messages && messages.map(this.renderMessage)}

                        {working && (
                            <div className="py-8 text-center text-white">
                                <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
                            </div>
                        )}
                    </div>

                    <hr className="bg-white"/>

                    {this.renderForm()}
                </CardBody>
            </Card>
        );
    }

    /**
     * @method renderForm
     * @return {JSX.Element}
     */
    renderForm = () => {
        const {form, working, handleInput, handleSubmit} = this.props;

        return (
            <div className="relative w-full mt-2">
                <Textarea
                    containerClassName="mb-2"
                    rows={3}
                    value={form.message ?? ''}
                    onChange={(v) => handleInput('message', v)}
                />

                <div className="flex justify-end">
                    <PrimaryButton
                        onClick={() => !working && form.message ? handleSubmit(
                            null,
                            this.request,
                            (message) => this.handleAddMessage(message.data.data),
                            true
                        ) : false}
                        disabled={working || !form.message}
                        text="Submit"
                    />
                </div>
            </div>
        );
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

export default FormHandler(Chat);
