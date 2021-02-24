import React from 'react';
import DatePicker from 'react-datepicker';
import {Link} from 'react-router-dom';

import AdminLayout from 'Pages/Admin/AdminLayout';

import Delete from 'Components/Partials/Modals/Delete';
import {ModalTrigger} from 'Components/Modal';
import {FormHandler, Label, Input} from 'Components/Form';
import {PrimaryButton, SecondaryButton} from 'Components/Button';
import {DangerButton} from 'Components/Button';
import {Alert, Loading} from 'Components/Partials';

import Poll from 'Services/Api/MainStage/Poll';
import {Toast} from 'Services';

class Store extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Poll has been submitted successfully';

    /**
     * @var state
     * @type {{pollId: *, sessionId: *, loading: boolean}}
     */
    state = {
        loading: false,
        sessionId: this.props.match.params.session,
        pollId: this.props.match.params?.poll
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        if (this.state.pollId) {
            this.fetchPoll();
        } else {
            this.props.setInitialValues({
                answers: [
                    ''
                ]
            });
        }
    };

    fetchPoll = async () => {
        this.setState({loading: true});

        const request = await Poll.get({
            session: this.state.sessionId,
            poll: this.state.pollId,
        });

        if (request.success) {
            const s = request.data.data;

            this.props.setInitialValues({
                ...request.data.data,
                answers: s.answers.map(a => a.answer)
            });

            return this.setState({
                loading: false
            });
        }

        Toast.error();
    };

    handleDeleteAnswer = (k) => {
        const {form, handleInput} = this.props;

        form.answers.splice(k, 1);

        handleInput('answers', form.answers);
    };

    handleAnswerInput = (value, k) => {
        const {form, handleInput} = this.props;

        form.answers[k] = value;

        handleInput('answers', form.answers);
    };

    handleAddAnswer = () => {
        const {form, handleInput} = this.props;

        form.answers.push('');

        handleInput('answers', form.answers);
    };

    /**
     * @method handleSubmit
     * @param {object} form
     * @return {Promise<boolean|{status: number}>|Promise<AxiosResponse<any>>|*}
     */
    handleSubmit = (form) => {
        if (this.state.pollId) {
            return Poll.patch({
                session: this.state.sessionId,
                poll: this.state.pollId
            }, form);
        } else {
            return Poll.post({
                session: this.state.sessionId
            }, form);
        }
    };

    render () {
        const {working, alert, form, handleInput, handleSubmit} = this.props;
        const {loading, sessionId, pollId} = this.state;

        return (
            <AdminLayout>
                {loading && (
                    <Loading />
                )}

                {!loading && (
                    <form
                        onSubmit={e => handleSubmit(e, this.handleSubmit, this.success, !pollId)}
                        className="divide-y divide-gray-200 lg:col-span-9"
                    >
                        <div className="p-6">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Main Stage - Polls
                            </h2>
                        </div>

                        <div className="p-6">
                            {alert && (<Alert {...alert} />)}

                            <Input
                                value={form.question}
                                onChange={v => handleInput('question', v)}
                                containerClassName="mb-4"
                                label="Question"
                            />

                            <div className="mb-4">
                                <Label label="Display From"/>
                                <DatePicker
                                    className="w-full border border-gray-300 rounded-md shadow-sm"
                                    selected={form.ends_at}
                                    onChange={date => handleInput('ends_at', date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    minutes={5}
                                    timeIntervals={5}
                                />
                            </div>

                            <div>
                                <Label label="Answers" />

                                {form.answers?.map((item, k) => (
                                    <div className="grid grid-cols-6 mb-2 gap-4" key={k}>
                                        <div className="col-span-5">
                                            <Input
                                                value={item}
                                                onChange={(v) => this.handleAnswerInput(v, k)}
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <ModalTrigger
                                                component={Delete}
                                                props={{
                                                    message: 'Are you sure you want delete this answer? Any results submitted will be deleted',
                                                    onDelete: () => this.handleDeleteAnswer(k)
                                                }}
                                            >
                                                <DangerButton type="button" className="w-full text-center" text="Remove" />
                                            </ModalTrigger>
                                        </div>
                                    </div>
                                ))}

                                <div className="w-full text-center">
                                    <PrimaryButton text="Add Answer" onClick={this.handleAddAnswer} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex justify-end">
                            <Link to={`/admin/main-stage/polls/${sessionId}`} className="mr-4">
                                <SecondaryButton text="Back" type="button"/>
                            </Link>

                            <PrimaryButton working={working} text="Save"/>
                        </div>
                    </form>
                )}
            </AdminLayout>
        );
    }
}

export default FormHandler(Store);
