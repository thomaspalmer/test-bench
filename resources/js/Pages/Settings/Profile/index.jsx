import React from 'react';

import {PrimaryButton} from 'Components/Button';
import {FormHandler, Input} from 'Components/Form';
import {Alert} from 'Components/Partials';

import {User} from 'Services';
import Me from 'Services/Api/Me/Me';

import SettingsPage from '../SettingsPage';

class Profile extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your details have been updated successfully';

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.props.setForm({
            first_name: User.data.first_name,
            last_name: User.data.last_name,
            email: User.data.email,
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <SettingsPage>
                <form
                    className="divide-y divide-gray-200 lg:col-span-9"
                    onSubmit={(e) => handleSubmit(e, Me.update, this.success)}
                >
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Profile</h2>
                    </div>

                    <div className="p-6">
                        {alert !== null && (<Alert {...alert} />)}

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <Input
                                    label="First Name"
                                    value={form.first_name}
                                    id="first_name"
                                    onChange={(v) => handleInput('first_name', v)}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Last Name"
                                    value={form.last_name}
                                    id="last_name"
                                    onChange={(v) => handleInput('last_name', v)}
                                />
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Email"
                                value={form.email}
                                id="email"
                                onChange={(v) => handleInput('email', v)}
                                readOnly={!window.base.features.allow_email_change}
                            />
                        </div>
                    </div>

                    <div className="p-6 flex justify-end">
                        <PrimaryButton
                            text="Save"
                            working={working}
                        />
                    </div>
                </form>
            </SettingsPage>
        );
    }
}

export default FormHandler(Profile);
