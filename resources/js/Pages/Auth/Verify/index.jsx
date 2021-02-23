import React from 'react';
import {withRouter} from 'react-router-dom';

import Unauthenticated from 'Components/Layouts/Unauthenticated';
import {Card, CardBody, CardHeader, CardFooter} from 'Components/Card';
import {Loading, Alert} from 'Components/Partials';
import {Link} from 'Components/Utilities';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';

import Auth from 'Services/Api/Auth/Auth';

class Verify extends React.Component {
    state = {
        stage: 'verifying'
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.getVerificationStatus();
    };

    /**
     * @method getVerificationStatus
     * @return {Promise<void>}
     */
    getVerificationStatus = async () => {
        const request = await Auth.verificationStatus(
            this.props.match.params.user,
            this.props.match.params.token
        );

        if (request.success) {
            const user = request.data.data;

            if (user.has_password && user.has_profile) {
                this.verifyAccount();
            } else {
                this.setState({stage: 'information', user});

                if (!user.has_profile) {
                    this.props.setForm({
                        ...user
                    });
                }
            }
        } else {
            this.setState({stage: 'error'});
        }
    };

    /**
     * @method request
     * @param {object} form
     * @return {Promise<*>}
     */
    request = (form = {}) => {
        return Auth.verify(
            this.props.match.params.user,
            this.props.match.params.token,
            form
        );
    };

    /**
     * @method verifyAccount
     * @return {Promise<*>}
     */
    verifyAccount = async () => {
        const request = await this.request();

        this.setState({
            stage: request.success ? 'complete' : 'error'
        });

        return request;
    };

    /**
     * @method verifyAccountWithPassword
     * @return {Promise<*>}
     */
    verifyAccountWithInformation = async (form) => {
        const request = await this.request(form);

        if (request.success) {
            this.setState({
                stage: 'complete'
            });
        }

        return request;
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {stage} = this.state;
        return (
            <Unauthenticated>
                <Card>
                    <CardHeader>
                        Verify your account
                    </CardHeader>

                    {stage === 'information' && this.renderInformationForm()}
                    {stage === 'verifying' && this.renderLoading()}
                    {stage === 'complete' && this.renderCompleteMessage()}
                    {stage === 'error' && this.renderErrorMessage()}
                </Card>
            </Unauthenticated>
        );
    }

    /**
     * @method renderInformationForm
     * @return {JSX.Element}
     */
    renderInformationForm = () => {
        const {user} = this.state;
        const {working, form, handleInput, handleSubmit, alert} = this.props;

        return (
            <form onSubmit={(e) => handleSubmit(e, this.verifyAccountWithInformation)}>
                <CardBody>
                    {alert !== null && (<Alert {...alert} />)}

                    <div className="grid grid-cols-2 gap-4">
                        {!user.has_profile && (
                            <React.Fragment>
                                <div>
                                    <Input
                                        label="First Name"
                                        id="first_name"
                                        value={form.first_name}
                                        onChange={(v) => handleInput('first_name', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Last Name"
                                        id="last_name"
                                        value={form.last_name}
                                        onChange={(v) => handleInput('last_name', v)}
                                    />
                                </div>
                            </React.Fragment>
                        )}

                        {!user.has_password && (
                            <React.Fragment>
                                <div>
                                    <Input
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={form.password}
                                        onChange={(v) => handleInput('password', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Password Confirmation"
                                        type="password"
                                        id="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={(v) => handleInput('password_confirmation', v)}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>

                </CardBody>

                <CardFooter>
                    <div className="flex justify-end">
                        <PrimaryButton working={working} text="Verify"/>
                    </div>
                </CardFooter>
            </form>
        )
    };

    /**
     * @method renderCompleteMessage
     * @return {JSX.Element}
     */
    renderCompleteMessage = () => {
        return (
            <CardBody>
                <p className="text-center">
                    Your details are now verified, you can now <Link to="/login">login into</Link> your account.
                </p>
            </CardBody>
        );
    };

    /**
     * @method renderCompleteMessage
     * @return {JSX.Element}
     */
    renderErrorMessage = () => {
        return (
            <CardBody>
                <p className="text-center text-red-500">
                    Sorry, there was a problem verifying your account. Please try again later
                </p>
            </CardBody>
        );
    };

    /**
     * @method renderLoading
     * @return {JSX.Element}
     */
    renderLoading = () => {
        return (
            <CardBody>
                <Loading/>
            </CardBody>
        );
    };
}

export default FormHandler(withRouter(Verify));
