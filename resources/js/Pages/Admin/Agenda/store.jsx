import React from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import CKEditor from 'ckeditor4-react';

import AdminLayout from '../AdminLayout';

import {PrimaryButton} from 'Components/Button';
import {FormHandler, Label, Input, Toggle} from 'Components/Form';
import {Alert, Loading} from 'Components/Partials';

import AdminAgendaApi from 'Services/Api/Admin/Agenda';

class AgendaStore extends React.Component {

    /**
     * @var success
     * @type {string}
     */
    success = 'Agenda item ' + (this.props.match?.params?.agenda ? 'updated' : 'created') + ' successfully';

    /**
     * @var state
     * @type {{agenda_id: string}}
     */
    state = {
        agenda_id: this.props.match?.params?.agenda ?? '',
    };

    /**
     * @method componentDidMount
     */
    componentDidMount() {        
        if (this.state.agenda_id) {
            this.loadAgenda();
        } else {
            this.props.setInitialValues({
                'active': true,
                'start_date_time': new Date(),
                'end_date_time': new Date(),
                'title': null,
                'content': null,
                'presenters': null,
                'show_add_to_agenda_button': false,
                'show_add_to_agenda_button_start_date_time': null,
                'show_add_to_agenda_button_end_date_time': null,
                'show_add_to_calendar_button': false,
                'show_add_to_calendar_button_only_if_in_agenda': false,
                'join_link': null,
                'join_link_display_start_date_time': null,
                'join_link_display_end_date_time': null,
                'join_link_display_only_if_in_agenda': false,
                'spaces': null,
            });
        }
    }

    /**
     * @method loadAgenda
     * @param {int} page
     */
    loadAgenda = async (page = 1) => {
        const {agenda_id} = this.state;

        const response = await AdminAgendaApi.get(agenda_id);

        let agenda = response.data.data;

        this.props.setForm({
            'active': agenda.active,
            'start_date_time': new Date(agenda.start_date_time),
            'end_date_time': new Date(agenda.end_date_time),
            'title': agenda.title,
            'content': agenda.content,
            'presenters': agenda.presenters,
            'show_add_to_agenda_button': agenda.show_add_to_agenda_button,
            'show_add_to_agenda_button_start_date_time': agenda.show_add_to_agenda_button_start_date_time 
                ? new Date(agenda.show_add_to_agenda_button_start_date_time) : null,
            'show_add_to_agenda_button_end_date_time': agenda.show_add_to_agenda_button_end_date_time 
                ? new Date(agenda.show_add_to_agenda_button_end_date_time) : null,
            'show_add_to_calendar_button': agenda.show_add_to_calendar_button,
            'show_add_to_calendar_button_only_if_in_agenda': agenda.show_add_to_calendar_button_only_if_in_agenda,
            'join_link': agenda.join_link,
            'join_link_display_start_date_time': agenda.join_link_display_start_date_time 
                ? new Date(agenda.join_link_display_start_date_time) : null,
            'join_link_display_end_date_time': agenda.join_link_display_end_date_time 
                ? new Date(agenda.join_link_display_end_date_time) : null,
            'join_link_display_only_if_in_agenda': agenda.join_link_display_only_if_in_agenda,
            'spaces': agenda.spaces,
        });
    }

    /**
     * @method handleSubmit
     * @param {object} form
     * @return {Promise<*>}
     */
    handleSubmit = (form) => {
        const {agenda_id} = this.state;

        if (agenda_id) {
            return AdminAgendaApi.patch(agenda_id, form);
        } else {
            return AdminAgendaApi.post(null, form);
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() { 
        const {agenda_id} = this.state;
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Agenda - {agenda_id ? 'Update' : 'Create'} Agenda Item
                        </h2>
                    </div>
                </div>

                <div className="m-4">
                    <form
                        className="divide-y divide-gray-200 lg:col-span-9"
                        onSubmit={(e) => handleSubmit(e, this.handleSubmit, this.success, (agenda_id ? false : true))}
                    >
                        {alert !== null && (<Alert {...alert} />)}

                        <div className="bg-gray-300 p-4 rounded mb-8">
                            <h3 className="text-lg leading-6 font-medium py-4 font-bold">Agenda Info</h3>

                            <div className="grid grid-cols-1 gap-4 py-8 border-0">
                                <div className="my-auto">
                                    <Toggle
                                        label="Active"
                                        value={form.active}
                                        onChange={v => handleInput('active', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Title"
                                        value={form.title}
                                        id="title"
                                        onChange={(v) => handleInput('title', v)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-0">
                                    <div>
                                        <Label label="Start Date Time (UTC)" />

                                        <DatePicker 
                                            selected={form.start_date_time} 
                                            onChange={date => handleInput('start_date_time', date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                        />
                                    </div>

                                    <div>
                                        <Label label="End Date Time (UTC)" />

                                        <DatePicker 
                                            selected={form.end_date_time} 
                                            onChange={date => handleInput('end_date_time', date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label label="Content" />

                                    <CKEditor
                                        type="classic"
                                        data={form.content}
                                        onChange={ ( evt ) => {
                                            const data = evt.editor.getData();
                                            handleInput('content', data);
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label label="Presenters" />

                                    <CKEditor
                                        type="classic"
                                        data={form.presenters}
                                        onChange={ ( evt ) => {
                                            const data = evt.editor.getData();
                                            handleInput('presenters', data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-300 p-4 rounded mb-8">
                            <h3 className="text-lg leading-6 font-medium py-4 font-bold">Add To Agenda Button</h3>

                            <div className="grid grid-cols-2 gap-4 py-8 border-0">
                                <div className="my-auto">
                                    <Toggle
                                        label="Show Add To Agenda Button"
                                        value={form.show_add_to_agenda_button}
                                        onChange={v => handleInput('show_add_to_agenda_button', v)}
                                    />
                                </div>

                                {form.show_add_to_agenda_button &&
                                    <>
                                        <div>
                                            <Input
                                                type="number"
                                                label="Spaces"
                                                value={form.spaces}
                                                id="title"
                                                onChange={(v) => handleInput('spaces', v)}
                                            />
                                        </div>

                                        <div className="my-4"><p>Leave the below times empty to show by default.</p></div>
                                        <div></div>

                                        <div>
                                            <Label label="Show Add To Agenda Button Start Date Time (UTC)" />

                                            <DatePicker 
                                                selected={form.show_add_to_agenda_button_start_date_time} 
                                                onChange={date => handleInput('show_add_to_agenda_button_start_date_time', date)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>

                                        <div>
                                            <Label label="Show Add To Agenda Button End Date Time (UTC)" />

                                            <DatePicker 
                                                selected={form.show_add_to_agenda_button_end_date_time} 
                                                onChange={date => handleInput('show_add_to_agenda_button_end_date_time', date)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div className="bg-gray-300 p-4 rounded mb-8">
                            <h3 className="text-lg leading-6 font-medium py-4 font-bold">Add To Calendar Button</h3>
                            
                            <div className="grid grid-cols-2 gap-4 py-8 border-0">
                                <div className="my-auto">
                                    <Toggle
                                        label="Show Add To Calendar Button"
                                        value={form.show_add_to_calendar_button}
                                        onChange={v => handleInput('show_add_to_calendar_button', v)}
                                    />
                                </div>

                                {form.show_add_to_calendar_button &&
                                    <div className="my-auto">
                                        <Toggle
                                            label="Show Add To Calendar Button Only If In Agenda"
                                            value={form.show_add_to_calendar_button_only_if_in_agenda}
                                            onChange={v => handleInput('show_add_to_calendar_button_only_if_in_agenda', v)}
                                        />
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="bg-gray-300 p-4 rounded mb-8">
                            <h3 className="text-lg leading-6 font-medium py-4 font-bold">Join Link</h3>

                            <div className="grid grid-cols-2 gap-4 py-8 border-0">
                                <div>
                                    <Input
                                        label="Join Link (Include the http)"
                                        value={form.join_link}
                                        id="title"
                                        onChange={(v) => handleInput('join_link', v)}
                                    />
                                </div>

                                {form.join_link &&
                                    <>
                                        <div className="my-auto">
                                            <Toggle
                                                label="Join Link Display Only If In Agenda"
                                                value={form.join_link_display_only_if_in_agenda}
                                                onChange={v => handleInput('join_link_display_only_if_in_agenda', v)}
                                            />
                                        </div>

                                        <div className="my-4"><p>Leave the below times empty to show by default.</p></div>
                                        <div></div>
                                        
                                        <div>
                                            <Label label="Join Link Display Start Date Time (UTC)" />

                                            <DatePicker 
                                                selected={form.join_link_display_start_date_time} 
                                                onChange={date => handleInput('join_link_display_start_date_time', date)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>

                                        <div>
                                            <Label label="Join Link Display End Date Time (UTC)" />

                                            <DatePicker 
                                                selected={form.join_link_display_end_date_time} 
                                                onChange={date => handleInput('join_link_display_end_date_time', date)}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div className="p-6 flex justify-end">
                            <PrimaryButton
                                text="Save"
                                working={working}
                            />
                        </div>
                    </form>
                </div>
            </AdminLayout>
        )
    }
}

export default FormHandler(AgendaStore);
