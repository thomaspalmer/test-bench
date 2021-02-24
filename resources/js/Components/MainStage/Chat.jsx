import React from 'react';
import TimeAgo from 'react-timeago';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

import {FormHandler} from 'Components/Form';
// import SendButton from 'Components/Button/SendButton';

import ChatApi from 'Services/Api/MainStage/Chat';

import {Toast, Socket} from 'Services';

class Chat extends React.Component {
    /**
     * @var containerRef
     * @type {null|HTMLDivElement}
     */
    containerRef = null;

    /**
     * @var state
     * @type {{comments: [], meta: null, working: boolean}}
     */
    state = {
        working: false,
        comments: [],
        meta: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchComments();

        this.containerRef.addEventListener('scroll', this.handleLoadMore);

        Socket.getConnection()
            .private(`comments.${this.props.sessionId}`)
            .listen('MainStageComment', (e) => {
                if (e.comment.user_id !== this.props.userId) {
                    this.handleAddComment(e.comment);
                }
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
     * @method fetchComments
     * @return {Promise<void>}
     */
    fetchComments = async () => {
        if (this.state.working || (this.state.meta !== null && this.state.meta?.current_page === this.state.meta?.last_page)) {
            return;
        }

        this.setState({working: true});

        const request = await ChatApi.get(null, {
            page: (this.state.meta?.current_page ?? 0) + 1
        });

        if (request.success) {
            return this.setState({
                comments: [...this.state.comments, ...request.data.data],
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
            this.fetchComments();
        }
    };

    /**
     * @method request
     * @param {object} data
     * @return {Promise<*>}
     */
    request = (data) => {
        return ChatApi.post(null, {
            ...data,
            session_id: this.props.sessionId
        });
    };

    /**
     * @method handleAddComment
     * @param {object} comment
     */
    handleAddComment = (comment) => {
        const {comments} = this.state;

        comments.unshift(comment);

        this.setState({
            comments
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {comments, working} = this.state;

        return (
            <div>
                <div className="overflow-y-scroll max-h-96 overflow-y-auto" ref={ref => this.containerRef = ref}>
                    {comments && comments.map(this.renderComment)}

                    {working && (
                        <div className="py-8 text-center text-white">
                            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                        </div>
                    )}
                </div>

                <hr className="bg-white" />

                {this.renderForm()}
            </div>
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
                <textarea
                    rows={3}
                    className="w-full bg-ve-blue-5 bg-opacity-20 rounded-md border-none text-white font-orgon text-md pr-20"
                    value={form.message ?? ''}
                    onChange={(e) => handleInput('message', e.target.value)}
                />

                {/*<SendButton*/}
                {/*    onClick={() => !working && form.message ? handleSubmit(*/}
                {/*        null,*/}
                {/*        this.request,*/}
                {/*        (comment) => this.handleAddComment(comment.data.data),*/}
                {/*        true*/}
                {/*    ) : false}*/}
                {/*    disabled={working || !form.message}*/}
                {/*/>*/}
            </div>
        );
    };

    /**
     * @method renderComment
     * @param comment {object}
     * @return {JSX.Element}
     */
    renderComment = (comment) => {
        return (
            <div className="bg-ve-blue-5 bg-opacity-20 rounded-md p-3 mb-2" key={comment.id}>
                <div className="text-md mb-1 text-white leading-5">
                    {comment.message.split('\n').map((item, key) => (
                        <p className="mb-1" key={key}>
                            {item}
                        </p>
                    ))}
                </div>

                <div className="flex justify-between text-xs text-white">
                    <span>{comment.user.first_name} {comment.user.last_name[0]}</span>
                    <span>
                        <TimeAgo date={comment.created_at} />
                    </span>
                </div>
            </div>
        );
    }
}

export default FormHandler(Chat);
