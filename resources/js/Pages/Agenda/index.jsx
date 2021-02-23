import React from 'react';
import {Link} from 'react-router-dom';
import {DateTime} from 'luxon';

import Authenticated from 'Components/Layouts/Authenticated';
import {Loading, Alert} from 'Components/Partials';
import {PrimaryButton, DangerButton, SecondaryButton} from 'Components/Button';

import AgendaApi from 'Services/Api/Agenda/Agenda';
import {Toast} from 'Services';

export default class AgendaIndex extends React.Component {

    /**
     * @var timezone
     * 
     * All dates and times are stored as UTC.
     * Select the timezone you wish to display.
     * 
     * For local browser time;
     * timezone: DateTime.local().toFormat('ZZZZ')
     */
    timezone = DateTime.local().toFormat('ZZZZ');

    /**
     * @var state
     */
    state = {
        loading: true,
        alert: null,
        agendas: null,
        dates: null,
        active_date: null,
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = async () => {
        this.getAgenda();
    }

    /**
     * @method getAgenda
     */
    getAgenda = async () => {
        this.setState({
            loading: true
        });

        const request = await AgendaApi.get(null, {
            timezone: encodeURIComponent(this.timezone)
        });

        if (request.success) {
            // Get all dates.
            const dates = [...new Set(
                request.data.data.map(agenda => agenda.timezone_start_date)
            )];

            return this.setState({
                loading: false,
                agendas: request.data.data,
                dates,
                active_date: this.state.active_date ?? dates[0]
            });

            // TODO scroll back to where they were on the page.
        }

        Toast.error();
    };

    /**
     * @method addToAgenda
     * @param {string} agenda_id
     */
    addToAgenda = async (agenda_id) => {
        this.setState({
            loading: true,
            alert: null
        });

        const response = await AgendaApi.post(null, {agenda_id});

        if (response.success) {
            return this.getAgenda();
        }

        this.setState({
            alert: {
                type: 'error',
                ...response
            },
            loading: false
        }, () => {
            document.getElementById('alert').scrollIntoView();
        });
    }

    /**
     * @method removeFromAgenda
     * @param {string} agenda_id
     */
    removeFromAgenda = async (agenda_id) => {
        this.setState({
            loading: true,
            alert: null
        });

        const response = await AgendaApi.delete(agenda_id);

        this.getAgenda();
    }

    /**
     * @method generateICalLink
     * @param {object} agenda
     */
    generateICalLink = (agenda) => {

        // E.g. 2021-02-08T08:05:00.000000Z to 20210208T080500Z
        var startTime = agenda.start_date_time.replace(/-/g, ''); // Remove all "-"
        startTime = startTime.replace(/:/g, ''); // Remove all ":"
        startTime = startTime.split('.')[0] + 'Z'; // Remove trailing milliseconds.

        var endTime = agenda.end_date_time.replace(/-/g, ''); // Remove all "-"
        endTime = endTime.replace(/:/g, ''); // Remove all ":"
        endTime = endTime.split('.')[0]  + 'Z'; // Remove trailing milliseconds

        var data = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTEND;TZID=Europe/London:${endTime}
DTSTART;TZID=Europe/London:${startTime}
SUMMARY:${agenda.title}
DESCRIPTION:
LOCATION:${process.env.MIX_APP_URL}
END:VEVENT
END:VCALENDAR`;

        var filename = agenda.title + '.ics';

        var file = new Blob([data], {type: 'ics'});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    /**
     * @method getDayOfMonthSuffix
     * @param {string} num
     * @return {string}
     */
    getDayOfMonthSuffix = (num) => {
        const th = 'th'
        const rd = 'rd'
        const nd = 'nd'
        const st = 'st'

        if (num == 11 || num == 12 || num == 13) return th

        let lastDigit = num.toString().slice(-1)

        switch (lastDigit) {
            case '1': return st
            case '2': return nd
            case '3': return rd
            default:  return th
        }
    }

    /**
     * @method render
     * @return {*}
     */
    render () {
        const {loading, alert, agendas} = this.state;

        return (
            <Authenticated>
                <div className="p-4 text-center">
                    <h1 className={"h1 mt-4 mb-8 font-bold"}>Agenda</h1>

                    {loading && <Loading />}

                    {!loading && 
                        <div>
                            {alert &&
                                <div className="px-8 py-4 mx-auto" id="alert">
                                    <Alert {...alert} />
                                </div>
                            }

                            {!agendas || agendas.length === 0 &&
                                <p className="font-bold">
                                    There are currently no agenda items to show you.
                                </p>
                            }

                            {agendas && agendas.length !== 0 &&
                                <div>
                                    {this.renderDates()}
                                    {this.renderAgendas()}
                                </div>
                            }
                        </div>
                    }
                </div>
            </Authenticated>
        );
    }

    /**
     * @method renderDates
     * @return {*}
     */
    renderDates() {
        const {dates, active_date} = this.state;

        return (
            <div className={"flex flex-col md:flex-row mx-auto my-8 justify-center"}>
                {dates && dates.map((date, i) => {

                    // E.g. Monday 8th February.
                    // https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
                    let object = DateTime.fromFormat(date, "dd/LL/yyyy");

                    let date_string = object.toFormat('EEEE d') 
                        + this.getDayOfMonthSuffix(object.toFormat('d')) 
                        + ' ' + object.toFormat('MMMM');

                    return (
                        <button
                            key={i}
                            onClick={() => this.setState({active_date: date})}
                            className={`
                                my-2 md:mx-4 py-4 px-8 rounded
                                ${active_date === date ?
                                    'bg-light-blue-800 text-white'
                                    : 'bg-gray-300 text-black hover:bg-light-blue-800 hover:text-white'
                                }
                            `}
                        >
                            {date_string}
                        </button>
                    )
                })}
            </div>
        );
    }

    /**
     * @method renderAgendas
     * @return {*}
     */
    renderAgendas() {
        const {agendas, active_date} = this.state;

        // Render desktop and mobile layout.
        return (
            <>
                <div className="hidden md:inline overflow-x-auto">
                    <table className="table-auto mx-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Time ({this.timezone})</th>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Presenters</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendas.filter(agenda => agenda.timezone_start_date === active_date)
                            .map((agenda, i) => {
                                return (
                                    <tr key={i}>
                                        <td className="px-4 py-2 border">{agenda.timezone_start_time}</td>
                                        <td className="px-4 py-2 border">{agenda.title}</td>
                                        <td className="px-4 py-2 border" dangerouslySetInnerHTML={{ __html: agenda.content }}></td>
                                        <td className="px-4 py-2 border" dangerouslySetInnerHTML={{ __html: agenda.presenters }}></td>
                                        <td className="px-4 py-2 border">{this.renderAgendaActions(agenda)}</td>

                                        {agenda.show_add_to_agenda_button_now && 
                                            <td className="px-4 py-2 border">{this.renderSpacesColumn(agenda)}</td>
                                        }
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="inline md:hidden">
                    {agendas.filter(agenda => agenda.timezone_start_date === active_date)
                    .map((agenda, i) => {
                        return (
                            <div className="mb-4" key={i}>
                                <div className="flex border-b-2">
                                    <div className="px-4 py-2 w-1/2 bg-light-blue-800 text-white flex items-center justify-center">Time ({this.timezone})</div>
                                    <div className="px-4 py-2 w-1/2 bg-gray-300 text-black">{agenda.timezone_start_time}</div>
                                </div>
                                <div className="flex border-b-2">
                                    <div className="px-4 py-2 w-1/2 bg-light-blue-800 text-white flex items-center justify-center">Title</div>
                                    <div className="px-4 py-2 w-1/2 bg-gray-300 text-black">{agenda.title}</div>
                                </div>
                                <div className="flex border-b-2">
                                    <div className="px-4 py-2 w-1/2 bg-light-blue-800 text-white flex items-center justify-center">Description</div>
                                    <div className="px-4 py-2 w-1/2 bg-gray-300 text-black" dangerouslySetInnerHTML={{ __html: agenda.content }}></div>
                                </div>
                                <div className="flex border-b-2">
                                    <div className="px-4 py-2 w-1/2 bg-light-blue-800 text-white flex items-center justify-center">Presenters</div>
                                    <div className="px-4 py-2 w-1/2 bg-gray-300 text-black" dangerouslySetInnerHTML={{ __html: agenda.presenters }}></div>
                                </div>
                                <div className="flex border-b-2">
                                    <div className="px-4 py-2 w-full bg-gray-300 text-black">{this.renderAgendaActions(agenda)}</div>
                                </div>
                                <div className="flex border-b-2">
                                    {agenda.show_add_to_agenda_button_now && 
                                        <div className="px-4 py-2 w-full bg-gray-300 text-black">{this.renderSpacesColumn(agenda)}</div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }

    /**
     * @method renderAgendaActions
     * @param {object} agenda
     * @return {*}
     */
    renderAgendaActions(agenda) {
        return (
            <div className="flex flex-col">
                { agenda.show_add_to_agenda_button_now &&
                    this.renderAddToAgendaButton(agenda)
                }

                { (agenda.show_add_to_calendar_button && 
                    (agenda.show_add_to_calendar_button_only_if_in_agenda === false || agenda.in_my_agenda)) &&
                    this.renderAddToCalendarButton(agenda)
                }

                { (agenda.show_join_link_now && 
                    (agenda.join_link_display_only_if_in_agenda === false || agenda.in_my_agenda)) &&
                    this.renderJoinLinkButton(agenda)
                }
            </div>
        );
    }

    /**
     * @method renderAddToAgendaButton
     * @param {object} agenda
     * @return {*}
     */
    renderAddToAgendaButton(agenda) {
        if (agenda.in_my_agenda) {
            return (
                <div className="my-2">
                    <DangerButton text="Remove From Your Agenda" onClick={() => this.removeFromAgenda(agenda.id)} />
                </div>
            )
        }

        if (!agenda.in_my_agenda) {
            return (
                <div className="my-2">
                    <PrimaryButton text="Add To Your Agenda" onClick={() => this.addToAgenda(agenda.id)} />
                </div>
            )
        }
    }

    /**
     * @method renderAddToCalendarButton
     * @param {object} agenda
     * @return {*}
     */
    renderAddToCalendarButton(agenda) {
        return (
            <div className="my-2">
                <SecondaryButton text="Add To Calendar" onClick={() => this.generateICalLink(agenda)} />
            </div>
        );
    }

    /**
     * @method renderJoinLinkButton
     * @param {object} agenda
     * @return {*}
     */
    renderJoinLinkButton(agenda) {
        return (
            <a href={agenda.join_link} target="_blank" className="my-2">
                <PrimaryButton text="Join" />
            </a>
        );
    }

    /**
     * @method renderSpacesColumn
     * @param {object} agenda
     * @return {*}
     */
    renderSpacesColumn(agenda) {
        return (
            <span className="font-bold">
                {agenda.spaces &&
                    <>
                        {agenda.available_spaces}
                        <br/>
                        {agenda.available_spaces === 1 ? 'Space' : 'Spaces'} Available
                    </>
                }

                {!agenda.spaces &&
                   <>No Limit</>
               }
            </span>
        );
    }
}