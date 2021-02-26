import React from 'react';
import {DateTime} from 'luxon';

import {Poll, Chat, Reactions} from 'Components/MainStage';

import Sessions from 'Services/Api/MainStage/Sessions';
import {Toast, Socket} from 'Services';

export default class Remote extends React.Component {
    /**
     * @var state
     * @type {{currentSession: null, sessions: null, working: boolean}}
     */
    state = {
        working: false,
        sessions: null,
        currentSession: null,
        currentPoll: null,
        tab: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchSessions();

        Socket.getConnection()
            .private(`main_stage_sessions`)
            .listen('MainStageSessionsUpdated', (e) => this.fetchSessions(false))
            .listen('MainStagePollsUpdated', (e) => this.fetchSessions(false));

        this.interval = setInterval(this.updateSessions, 2000); // 2 seconds
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        window.clearInterval(this.interval);
    };

    /**
     * @method updateSessions
     */
    updateSessions = () => {
        const now = DateTime.now();

        const currentSession = this.state.sessions.find(session => {
            const startsAt = DateTime.fromISO(session.starts_at);
            const endsAt = session.ends_at !== null ? DateTime.fromISO(session.ends_at) : null;

            return now > startsAt && (endsAt === null || now < endsAt);
        });

        if (
            currentSession
        ) {
            const state = this.state;

            if ((currentSession.id !== this.state.currentSession?.id || currentSession.updated_at !== this.state.currentSession.updated_at)) {
                state.currentSession = currentSession;
            }

            // Current Poll
            if (currentSession.polls.length > 0) {
                // Display the last poll available
                let polls = currentSession.polls.filter(poll => now > DateTime.fromISO(poll.display_from));

                state.currentPoll = polls[polls.length - 1];
            }

            this.setState(state);
        } else if (!currentSession && this.state.currentSession) {
            this.setState({
                currentSession: null,
                currentPoll: null
            });
        }
    };

    /**
     * @method fetchSessions
     * @param {boolean} initialLoad
     * @return {Promise<void>}
     */
    fetchSessions = async (initialLoad = true) => {
        if (initialLoad) {
            this.setState({working: true});
        }

        const request = await Sessions.get(null, {
            starts_today: 1
        });

        if (request.success) {
            return this.setState({
                sessions: request.data.data,
                working: false
            }, this.updateSessions);
        }

        Toast.error();
    };

    /**
     * @method handleSetTab
     * @param {string} tab
     */
    handleSetTab = (tab) => {
        this.setState({
            tab
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {currentSession, tab} = this.state;

        return (
            <div className="h-screen w-screen">
                {currentSession && (
                    <React.Fragment>
                        <div className="h-5/6">
                            {tab === null && this.renderNoTab()}
                            {tab === 'chat' && this.renderChat()}
                            {tab === 'reactions' && this.renderReactions()}
                            {tab === 'polls' && this.renderPolls()}
                        </div>

                        <div className="h-1/6 flex">
                            {currentSession.chat && this.renderButton('Chat', 'chat')}
                            {currentSession.reactions && this.renderButton('Reactions', 'reactions')}
                            {this.renderButton('Polls', 'polls')}
                        </div>
                    </React.Fragment>
                )}

                {!currentSession && (
                    <div className="h-full w-full flex justify-center items-center">
                        <p>There are no sessions running at the moment, come back later.</p>
                    </div>
                )}
            </div>
        );
    }

    /**
     * @method renderNoTab
     * @returns {JSX.Element}
     */
    renderNoTab = () => {
        return (
            <div className="h-full w-full flex justify-center items-center">
                Select a tab to get started
            </div>
        );
    };

    renderChat = () => {
        const {currentSession} = this.state;

        return (
            <div className="h-full w-full flex justify-center items-center">
                <Chat
                    sessionId={currentSession?.id}
                />
            </div>
        );
    };

    renderReactions = () => {

    };

    /**
     * @method renderPolls
     * @return {JSX.Element}
     */
    renderPolls = () => {
        const {currentPoll, currentSession} = this.state;

        if (!currentPoll) {
            return (
                <div className="h-full w-full flex justify-center items-center">
                    There are currently no polls available
                </div>
            );
        }

        return (
            <div className="h-full w-full flex justify-center items-center">
                <Poll
                    poll={currentPoll}
                    sessionId={currentSession.id}
                />
            </div>
        );
    };

    /**
     * @method renderButton
     * @param {string} text
     * @param {string} tab
     * @return {JSX.Element}
     */
    renderButton = (text, tab) => {
        const {tab: activeTab} = this.state;

        return (
            <button
                className={`w-full h-full border-r border-t border-gray-200 ${activeTab === tab ? 'bg-indigo-500 text-white' : 'bg-white'}`}
                onClick={() => this.handleSetTab(tab)}
            >
                {text}
            </button>
        )
    }
}
