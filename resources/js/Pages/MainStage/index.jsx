import React from 'react';

import Authenticated from 'Components/Layouts/Authenticated';
import {Loading} from 'Components/Partials';
import {Stream, Chat, Reactions} from 'Components/MainStage';

import Sessions from 'Services/Api/MainStage/Sessions';
import {Toast, User, Socket} from 'Services';

export default class MainStage extends React.Component {
    /**
     * @var state
     * @type {{currentSession: null, sessions: null, working: boolean}}
     */
    state = {
        working: false,
        sessions: null,
        currentSession: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchSessions();

        Socket.getConnection()
            .private(`sessions`)
            .listen('SessionsUpdated', (e) => this.fetchSessions(false));

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
            const sessions = request.data;
            const currentSession = sessions.find(s => s.live);

            // TODO Get the next session

            return this.setState({
                sessions,
                currentSession,
                working: false
            });
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
                            <div className="grid grid-cols-3 gap-8">
                                <div className={`${currentSession?.chat ? 'col-span-2' : 'col-span-3'}`}>
                                    {currentSession?.reactions === true && (
                                        <Reactions
                                            side="right"
                                            ref={ref => this.reactions = ref}
                                            userId={User.id}
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
                                        Chat Box Here
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
