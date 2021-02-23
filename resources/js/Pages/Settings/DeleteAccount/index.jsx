import React from 'react';
import {withRouter} from 'react-router-dom';

import {DangerButton, PrimaryButton} from 'Components/Button';
import {FormHandler, Input} from 'Components/Form';
import {Alert} from 'Components/Partials';

import Me from 'Services/Api/Me/Me';

import SettingsPage from '../SettingsPage';

class DeleteAccount extends React.Component {
    state = {
        alert: null
    };

    /**
     * @method handleCancel
     */
    handleCancel = () => {
        this.props.history.push('/');
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <SettingsPage>
                <form className="divide-y divide-gray-200" onSubmit={(e) => handleSubmit(e, Me.remove)}>
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Permanently delete your account.
                        </h2>
                    </div>

                    <div className="p-6">
                        {alert !== null && (<Alert {...alert} />)}

                        <Input
                            label={
                                `
                                    Are you sure you want to delete your account? Once your account is deleted, all of
                                    its resources and data will be permanently deleted. Please enter your password to
                                    confirm you would like to permanently delete your account.
                                `
                            }
                            type="password"
                            value={form.password}
                            onChange={v => handleInput('password', v)}
                            id="password"
                        />
                    </div>

                    <div className="p-6 flex justify-end">
                        <PrimaryButton
                            type="button"
                            text="Cancel"
                            onClick={this.handleCancel}
                        />

                        <DangerButton
                            className="ml-2"
                            text="Continue"
                            working={working}
                        />
                    </div>
                </form>
            </SettingsPage>
        );
    }
}

export default withRouter(FormHandler(DeleteAccount));
