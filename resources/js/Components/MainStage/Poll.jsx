import React from 'react';

import {Card, CardHeader, CardBody, CardFooter} from 'Components/Card';
import {PrimaryButton} from 'Components/Button';

import PollsApi from 'Services/Api/MainStage/Poll';
import {Alert} from 'Components/Partials';

export default class Poll extends React.Component {
    /**
     * @var state
     * @type {{alert: null, working: boolean, submission: null, vote: null}}
     */
    state = {
        vote: null,
        working: false,
        alert: null,
        submission: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchSubmission();
    };

    /**
     * @method fetchSubmission
     * @return {Promise<void>}
     */
    fetchSubmission = async () => {
        const request = await PollsApi.get({
            session: this.props.sessionId
        }, {
            poll_id: this.props.poll.id
        });

        if (request.success) {
            return this.setState({
                submission: request.data.data
            });
        }
    };

    /**
     * @method handleVote
     * @param {string} vote
     */
    handleVote = (vote) => {
        this.setState({
            vote
        });
    };

    /**
     * @method handleSubmitVote
     * @return {Promise<void>}
     */
    handleSubmitVote = async () => {
        this.setState({working: true});

        const request = await PollsApi.post({
            session: this.props.sessionId
        }, {
            poll_id: this.props.poll.id,
            answer_id: this.state.vote
        });

        if (request.success) {
            return this.setState({
                alert: {
                    type: 'success',
                    message: 'Thank you for your submission'
                },
                working: false,
                submission: request.data.data
            });
        }

        this.setState({
            alert: {
                type: 'error',
                message: 'Sorry, there was a problem with your submission',
                errors: request.errors
            },
            working: false
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {poll} = this.props;
        const {vote, working, alert, submission} = this.state;

        return (
            <Card>
                <CardHeader>
                    {poll.question}
                </CardHeader>

                <CardBody>
                    {alert !== null && (<Alert {...alert} />)}

                    {poll.answers.map(a => (
                        <div className="relative p-4 flex" key={a.id}>
                            <div className="flex items-center h-5">
                                <input
                                    id={`vote-${a.id}`}
                                    type="radio"
                                    className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 ${submission ? '' : 'cursor-pointer'}`}
                                    checked={a.id === vote || (submission !== null && submission.answer_id === a.id)}
                                    onChange={() => this.handleVote(a.id)}
                                    disabled={submission !== null}
                                />
                            </div>
                            <label htmlFor={`vote-${a.id}`} className={`ml-3 flex flex-col ${submission ? '' : 'cursor-pointer'}`}>
                                <span className="block text-sm font-medium">
                                    {a.answer}
                                </span>
                            </label>
                        </div>
                    ))}

                </CardBody>

                <CardFooter>
                    <PrimaryButton
                        onClick={this.handleSubmitVote}
                        disabled={!vote || submission}
                        working={working}
                        text="Vote"
                    />
                </CardFooter>
            </Card>
        );
    }
}
