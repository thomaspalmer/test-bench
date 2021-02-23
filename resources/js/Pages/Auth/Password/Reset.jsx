import React from 'react';
import {withRouter} from 'react-router-dom';

import Unauthenticated from 'Components/Layouts/Unauthenticated';
import {Card, CardBody, CardFooter, CardHeader} from 'Components/Card';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Alert} from 'Components/Partials';
import {Link} from 'Components/Utilities';
import Auth from 'Services/Api/Auth/Auth';

class Reset extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your password has been reset';

    /**
     * @method handleSubmit
     * @param {object} form
     * @return {Promise<*>}
     */
    handleSubmit = (form) => {
        return Auth.resetPassword(
            this.props.match.params.token,
            form
        );
    };

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
                        Reset your password
                    </CardHeader>

                    <form onSubmit={(e) => handleSubmit(e, this.handleSubmit, this.success, true)}>
                        <CardBody>
                            {alert !== null && (<Alert {...alert} />)}

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
                                    >Back to login</Link>
                                </div>

                                <div>
                                    <PrimaryButton
                                        text="Reset"
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

export default FormHandler(withRouter(Reset));
