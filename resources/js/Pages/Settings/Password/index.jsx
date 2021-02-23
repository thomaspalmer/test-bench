import React from 'react';

import {PrimaryButton} from 'Components/Button';
import {FormHandler, Input} from 'Components/Form';
import {Alert} from 'Components/Partials';

import Me from 'Services/Api/Me/Me';

import SettingsPage from '../SettingsPage';

class Password extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your password has been updated successfully';

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <SettingsPage>
                <form
                    className="divide-y divide-gray-200"
                    onSubmit={(e) => handleSubmit(e, Me.updatePassword, this.success, true)}
                >
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Password</h2>
                    </div>

                    <div className="p-6">
                        {alert !== null && (<Alert {...alert} />)}

                        <Input
                            containerClassName="mb-4"
                            label="Current Password"
                            type="password"
                            value={form.current_password}
                            id="current_password"
                            onChange={(v) => handleInput('current_password', v)}
                        />

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={form.new_password}
                                    id="new_password"
                                    onChange={(v) => handleInput('new_password', v)}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    value={form.new_password_confirmation}
                                    id="new_password_confirmation"
                                    onChange={(v) => handleInput('new_password_confirmation', v)}
                                />
                            </div>
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

export default FormHandler(Password);
