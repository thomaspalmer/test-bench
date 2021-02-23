import React from 'react';
import {withRouter} from 'react-router-dom';

import Unauthenticated from 'Components/Layouts/Unauthenticated';
import {Card, CardBody, CardFooter, CardHeader} from 'Components/Card';
import {FormHandler, Input, Label} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Link} from 'Components/Utilities';
import {Alert} from 'Components/Partials';

import Auth from 'Services/Api/Auth/Auth';

class TwoFactorChallenge extends React.Component {
    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, alert, handleInput, handleSubmit, working} = this.props;

        return (
            <Unauthenticated>
                <Card>
                    <CardHeader>
                        Two Factor Challenge
                    </CardHeader>

                    <form onSubmit={(e) => handleSubmit(e, Auth.verifyTwoFactor)}>
                        <CardBody>
                            {alert !== null && (<Alert {...alert} />)}
                            <div>
                                <Label htmlFor="code" label="Authentication Code/Recovery Code"/>
                                <Input
                                    type="text"
                                    value={form.code}
                                    onChange={v => handleInput('code', v)}
                                />
                            </div>
                        </CardBody>

                        <CardFooter>
                            <div className="flex">
                                <div className="flex-1 flex items-center">
                                    <Link
                                        to="/logout"
                                    >Logout</Link>
                                </div>

                                <div>
                                    <PrimaryButton
                                        text="Verify"
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

export default FormHandler(withRouter(TwoFactorChallenge));
