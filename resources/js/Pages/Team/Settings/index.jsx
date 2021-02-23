import React from 'react';

import TeamSettingsPage from '../TeamSettingsPage';

import {Alert} from 'Components/Partials';
import {Input, Toggle, FormHandler} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';

import Teams from 'Services/Api/Teams/Teams';
import {User} from 'Services';

class Settings extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your team setting have been updated';

    /**
     * @method componentDidMount
     */
    componentDidMount = async () => {
        await this.props.setForm({
            name: User.data.active_team.name
        });

        if (window.base.features.two_factor) {
            await this.props.setForm({
                force_two_factor: User.data.active_team.force_two_factor
            });
        }
    };

    /**
     * @method updateTeam
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    updateTeam = (data) => {
        return Teams.update(User.data.active_team.id, data);
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <TeamSettingsPage>
                <form
                    className="divide-y divide-gray-200"
                    onSubmit={(e) => handleSubmit(e, this.updateTeam, this.success)}
                >
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Team Settings</h2>
                    </div>

                    <div className="p-6">
                        {alert !== null && (<Alert {...alert} />)}

                        <Input
                            containerClassName="mb-4"
                            label="Team Name"
                            type="text"
                            value={form.name}
                            id="name"
                            onChange={(v) => handleInput('name', v)}
                        />

                        {window.base.features.two_factor && (
                            <Toggle
                                label="Require two factor authentication for everyone in this team"
                                labelPlacement="top"
                                id="force_two_factor"
                                value={form.force_two_factor}
                                onChange={(v) => handleInput('force_two_factor', v)}
                            />
                        )}
                    </div>

                    <div className="p-6 flex justify-end">
                        <PrimaryButton
                            text="Save"
                            working={working}
                        />
                    </div>
                </form>
            </TeamSettingsPage>
        );
    }
}

export default FormHandler(Settings);
