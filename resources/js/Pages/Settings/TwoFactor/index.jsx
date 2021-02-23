import React from 'react';

import {Alert} from 'Components/Partials';
import {DangerButton, PrimaryButton} from 'Components/Button';

import SettingsPage from '../SettingsPage';

import TwoFactorApi from 'Services/Api/Me/TwoFactor';

import {User} from 'Services';

export default class TwoFactor extends React.Component {
    /**
     * @var state
     * @type {{codes: [], stage: string, qrCode: null, working: boolean}}
     */
    state = {
        stage: User.data.two_factor_secret !== null ? 'enabled' : 'welcome',
        qrCode: null,
        codes: [],
        working: false,
        force: User.data.teams?.filter(team => team.team?.force_two_factor).length > 0
    };

    /**
     * @method handleEnable
     * @return {Promise<void>}
     */
    handleEnable = async () => {
        this.setState({working: true});
        const request = await TwoFactorApi.enable();

        if (request.success) {
            const recoveryCodes = await TwoFactorApi.recoveryCodes();
            const qrCode = await TwoFactorApi.qrCode();

            if (recoveryCodes.success && qrCode.success) {
                this.setState({
                    qrCode: qrCode.data.data.svg,
                    codes: recoveryCodes.data.data.codes,
                    stage: 'enabled',
                    working: false
                });
            }
        }
    };

    /**
     * @method handleDisable
     * @return {Promise<void>}
     */
    handleDisable = async () => {
        const request = await TwoFactorApi.disable();

        if (request.success) {
            this.setState({
                stage: 'welcome'
            });
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {stage} = this.state;

        return (
            <SettingsPage>
                <div
                    className="divide-y divide-gray-200 lg:col-span-9"
                >
                    {stage === 'welcome' && this.renderWelcome()}
                    {stage === 'enabled' && this.renderEnabled()}
                </div>
            </SettingsPage>
        );
    }

    /**
     * @method renderWelcome
     * @return {JSX.Element}
     */
    renderWelcome = () => {
        const {working, force} = this.state;

        return (
            <React.Fragment>
                <div className="p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Two Factor</h2>
                </div>

                <div className="p-6">
                    {force && (
                        <Alert
                            type="warning"
                            message={"One of the teams you are a member of requires you to enable two factor authentication"}
                        />
                    )}

                    <Alert
                        type="warning"
                        message={(
                            <span>
                                To utilize two factor authentication, you must have access to a two factor compatible
                                application. We suggest that you
                                install <a href="https://support.google.com/accounts/answer/1066447" target="_blank">
                                Google Authenticator</a> application on your smartphone.
                            </span>
                        )}
                    />
                </div>

                <div className="p-6 flex justify-end">
                    <PrimaryButton
                        working={working}
                        onClick={this.handleEnable}
                        text="Enable"
                    />
                </div>
            </React.Fragment>
        );
    };

    /**
     * @method renderEnabled
     * @return {JSX.Element}
     */
    renderEnabled = () => {
        const {qrCode, codes} = this.state;

        return (
            <React.Fragment>
                <div className="p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Two Factor Enabled</h2>
                </div>

                <div className="p-6">
                    <p className="text-md">
                        When two factor authentication is enabled, you will be prompted for a secure, random token during
                        authentication. You may retrieve this token from your phone's Google Authenticator
                        application.
                    </p>

                    {qrCode !== null && (
                        <React.Fragment>
                            <p className="my-4 text-md">
                                Two factor authentication is now enabled. Scan the following QR code using your phone's
                                authenticator application.
                            </p>

                            <div dangerouslySetInnerHTML={{ __html: qrCode }}></div>

                            {codes.length > 0 && (
                                <React.Fragment>
                                    <p className="my-4 text-md">
                                        Store these recovery codes in a secure password manager. They can be used to recover
                                        access to your account if your two factor authentication device is lost.
                                    </p>

                                    <pre className="p-4 bg-gray-100">
                                        {codes.map(code => (
                                            <React.Fragment key={code}>
                                                <span>{code}</span><br />
                                            </React.Fragment>
                                        ))}
                                    </pre>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>

                <div className="p-6 flex justify-end">
                    <DangerButton
                        onClick={this.handleDisable}
                        text="Disable"
                    />
                </div>
            </React.Fragment>
        );
    };
}
