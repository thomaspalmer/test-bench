import React from 'react';
import {DateTime} from 'luxon';

import Authenticated from 'Components/Layouts/Authenticated';
import {Loading} from 'Components/Partials';
import {Stream, Poll, RemoteControl, Chat, Reactions} from 'Components/MainStage';

import Sessions from 'Services/Api/MainStage/Sessions';
import {Toast, Socket} from 'Services';

export default class MainStage extends React.Component {
    /**
     * @var state
     * @type {{currentSession: null, sessions: null, working: boolean}}
     */
    state = {
        working: false,
        sessions: null,
        currentSession: null,
        currentPoll: null
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
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, currentSession, currentPoll} = this.state;

        return (
            <Authenticated pageTitle="Dashboard">
                {working && (<Loading/>)}

                {!working && (
                    <React.Fragment>
                        {!currentSession && (
                            <div>
                                There are no sessions live
                            </div>
                        )}

                        {currentSession && (
                            <div>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className={`${currentSession?.chat ? 'col-span-2' : 'col-span-3'}`}>
                                        <h1 className="mb-2 text-2xl font-bold">{currentSession.title}</h1>

                                        {currentSession?.reactions === true && (
                                            <Reactions
                                                side="right"
                                                ref={ref => this.reactions = ref}
                                                sessionId={currentSession.id}
                                            >
                                                <Stream src={currentSession.stream_src}/>
                                            </Reactions>
                                        )}

                                        {currentSession?.reactions === false && (
                                            <Stream src={currentSession.stream_src}/>
                                        )}
                                    </div>

                                    {currentSession?.chat && (
                                        <div>
                                            <Chat
                                                sessionId={currentSession.id}
                                            />
                                        </div>
                                    )}
                                </div>

                                {currentSession?.remote_control && (
                                    <div className="w-full text-center">
                                        <RemoteControl
                                            sessionId={currentSession.id}
                                        />
                                    </div>
                                )}

                                {currentPoll && (
                                    <div className="w-full mt-4">
                                        <div className="w-1/2 mx-auto">
                                            <Poll
                                                poll={currentPoll}
                                                sessionId={currentSession.id}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                )}
            </Authenticated>
        );
    }
}
