import React from 'react';
import Unauthenticated from 'Components/Layouts/Unauthenticated';

import {Card, CardBody, CardFooter, CardHeader} from 'Components/Card';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Alert} from 'Components/Partials';
import {Link} from 'Components/Utilities';

import Auth from 'Services/Api/Auth/Auth';

class Login extends React.Component {
    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, handleInput, handleSubmit, working, alert} = this.props;

        return (
            <Unauthenticated>
                <Card>
                    <CardHeader>
                        Login
                    </CardHeader>

                    <form onSubmit={(e) => handleSubmit(e, Auth.login)}>
                        <CardBody>
                            {alert !== null && (<Alert {...alert} />)}

                            <Input
                                containerClassName="mb-4"
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={v => handleInput('email', v)}
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={form.password}
                                onChange={v => handleInput('password', v)}
                            />
                        </CardBody>

                        <CardFooter>
                            <div className="flex">
                                <div className="flex-1 flex items-center">
                                    {window.base.features.allow_password_resets && (
                                        <Link
                                            to="/password/request"
                                        >Forgot you password?</Link>
                                    )}
                                </div>

                                <div>
                                    <PrimaryButton
                                        text="Login"
                                        working={working}
                                    />
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {window.base.features.allow_registrations && (
                    <p className="text-center mt-4">
                        <Link
                            colour="text-white"
                            to="/register"
                        >Don't have an account? Register here</Link>
                    </p>
                )}
            </Unauthenticated>
        );
    }
}

export default FormHandler(Login);
