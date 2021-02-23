import React from 'react';
import {Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import CKEditor from 'ckeditor4-react';
import DateTime from 'luxon/src/datetime';

import AdminLayout from 'Pages/Admin/AdminLayout';
import {Input, Toggle, Label, FormHandler} from 'Components/Form';
import {Loading, Alert} from 'Components/Partials';
import {PrimaryButton, SecondaryButton} from 'Components/Button';

import Sessions from 'Services/Api/Admin/MainStage/Sessions';

import {Toast} from 'Services';

class Store extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Session has been submitted successfully';

    /**
     * @var state
     * @type {{now: boolean, session_id, loading: boolean}}
     */
    state = {
        now: false,
        loading: false,
        session_id: this.props.match?.params?.session ?? '',
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        if (this.state.session_id) {
            this.fetchSession();
        }
    };

    /**
     * @method fetchSession
     * @return {Promise<void>}
     */
    fetchSession = async () => {
        this.setState({
            loading: true
        });

        const request = await Sessions.get({
            session: this.state.session_id
        });

        if (request.success) {
            const s = request.data.data;

            this.props.setInitialValues({
                ...s,
                starts_at: s.starts_at !== null ? new Date(s.starts_at) : null,
                ends_at: s.ends_at !== null ? new Date(s.ends_at) : null,
            });

            return this.setState({
                loading: false
            });
        }

        return Toast.error();
    };

    /**
     * @method handleSubmit
     * @param {object} form
     * @return {Promise<boolean|{status: number}>|Promise<AxiosResponse<any>>|*}
     */
    handleSubmit = (form) => {
        form = {
            ...form,
            starts_at: this.state.now ? DateTime.now() : form.starts_at
        };

        if (this.state.session_id) {
            return Sessions.patch({
                session_id: this.state.session_id
            }, form);
        } else {
            return Sessions.post(null, form);
        }
    };

    /**
     * @method handleToggleStartsNow
     */
    handleToggleStartsNow = () => {
        this.setState({
            now: !this.state.now
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {handleInput, handleSubmit, alert, working, form} = this.props;
        const {now, loading, session_id} = this.state;

        return (
            <AdminLayout>
                {loading && (
                    <div className="p-6">
                        <Loading />
                    </div>
                )}

                {!loading && (
                    <form onSubmit={(e) => handleSubmit(e, this.handleSubmit, this.success, !session_id)}
                          className="divide-y divide-gray-200 lg:col-span-9">
                        <div className="p-6">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Main Stage - Create Session
                            </h2>
                        </div>

                        <div className="p-6">
                            {alert && (<Alert {...alert} />)}

                            <Input
                                containerClassName="mb-4"
                                label="Title"
                                value={form.title}
                                onChange={(v) => handleInput('title', v)}
                            />

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label label="Starts At"/>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                            <DatePicker
                                                disabled={now}
                                                className={`w-full border border-gray-300 rounded-l-md shadow-sm ${now ? 'opacity-50' : ''}`}
                                                selected={form.starts_at}
                                                onChange={date => handleInput('starts_at', date)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                                timeIntervals={5}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={this.handleToggleStartsNow}
                                            className={
                                                `-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 transition duration-200 focus:ring-0 ${now ? 'bg-indigo-500 text-white border-indigo-500' : ''}`
                                            }>
                                            Now
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label label="Ends At"/>
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
                            </div>

                            <div className="mb-4">
                                <Label label="Description"/>
                                <CKEditor
                                    type="classic"
                                    data={form.description}
                                    onChange={(evt) => {
                                        const data = evt.editor.getData();
                                        handleInput('description', data);
                                    }}
                                />
                            </div>

                            <Input
                                containerClassName="mb-4"
                                label="Stream src (e.g https://vimeo.com/event/666481/embed/287bdc599c)"
                                value={form.stream_src}
                                onChange={(v) => handleInput('stream_src', v)}
                            />

                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Features
                            </h3>

                            <div className="grid grid-cols-3">
                                <Toggle
                                    value={form.chat}
                                    onChange={(v) => handleInput('chat', v)}
                                    label="Chat"
                                />

                                <Toggle
                                    value={form.reactions}
                                    onChange={(v) => handleInput('reactions', v)}
                                    label="Reactions"
                                />
                            </div>
                        </div>

                        <div className="p-6 flex justify-end">
                            <Link to="/admin/main-stage" className="mr-4">
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
