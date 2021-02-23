import React from 'react';
import Unauthenticated from 'Components/Layouts/Unauthenticated';

import {Card, CardBody, CardFooter, CardHeader} from 'Components/Card';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Link} from 'Components/Utilities';
import {Alert} from 'Components/Partials';

import Auth from 'Services/Api/Auth/Auth';

class Request extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your password reset email is on the way';

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
                        Request a password reset
                    </CardHeader>

                    <form onSubmit={(e) =>
                        handleSubmit(e, Auth.requestPasswordEmail, this.success, true)}
                    >
                        <CardBody>
                            {alert !== null && (<Alert {...alert} />)}
                            <div>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={v => handleInput('email', v)}
                                />
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

export default FormHandler(Request);
