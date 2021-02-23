import React from 'react';
import Unauthenticated from 'Components/Layouts/Unauthenticated';

import {Card, CardBody, CardFooter, CardHeader} from 'Components/Card';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Link} from 'Components/Utilities';
import {Alert} from 'Components/Partials';

import Auth from 'Services/Api/Auth/Auth';

class Register extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your account has been successfully created. You will receive an email shortly to confirm your ' +
        'email address.';

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
                        Register
                    </CardHeader>

                    <form onSubmit={(e) => handleSubmit(e, Auth.register, this.success, true)}>
                        <CardBody>
                            {alert !== null && (<Alert {...alert} />)}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Input
                                        label="First Name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={v => handleInput('first_name', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Last Name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={v => handleInput('last_name', v)}
                                    />
                                </div>
                            </div>

                            <Input
                                containerClassName="mb-4"
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={v => handleInput('email', v)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={form.password}
                                        onChange={v => handleInput('password', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Password Confirmation"
                                        type="password"
                                        value={form.password_confirmation}
                                        onChange={v => handleInput('password_confirmation', v)}
                                    />
                                </div>
                            </div>
                        </CardBody>

                        <CardFooter>
                            <div className="flex">
                                <div className="flex-1 flex items-center">
                                    <Link
                                        to="/login"
                                    >Already have an account?</Link>
                                </div>

                                <div>
                                    <PrimaryButton
                                        text="Register"
                                        working={working}
                                    />
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </Unauthenticated>
        );
    }
}

export default FormHandler(Register);
