import React from 'react';
import {DateTime} from 'luxon';

import Authenticated from 'Components/Layouts/Authenticated';
import {Loading} from 'Components/Partials';
import {Stream, Chat, Reactions} from 'Components/MainStage';

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
            .private(`sessions`)
            .listen('SessionsUpdated', (e) => this.fetchSessions(false))
            .listen('PollsUpdated', (e) => this.fetchSessions(false));

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

        if (currentSession && currentSession.id !== this.state.currentSession?.id) {
            // Current Poll

            this.setState({
                currentSession
            });
        } else if (!currentSession && this.state.currentSession) {
            this.setState({
                currentSession: null
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
    render () {
        const {working, currentSession} = this.state;

        return (
            <Authenticated pageTitle="Dashboard">
                {working && (<Loading />)}

                {!working && (
                    <React.Fragment>
                        {!currentSession && (
                            <div>
                                There are no sessions live
                            </div>
                        )}

                        {currentSession && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className={`${currentSession?.chat ? 'col-span-2' : 'col-span-3'}`}>
                                    {currentSession?.reactions === true && (
                                        <Reactions
                                            side="right"
                                            ref={ref => this.reactions = ref}
                                            sessionId={currentSession.id}
                                        >
                                            <Stream src={currentSession.stream_src} />
                                        </Reactions>
                                    )}

                                    {currentSession?.reactions === false && (
                                        <Stream src={currentSession.stream_src} />
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
                        )}
                    </React.Fragment>
                )}
            </Authenticated>
        );
    }
}
