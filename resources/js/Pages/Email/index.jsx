import React from 'react';
import Unauthenticated from 'Components/Layouts/Unauthenticated';
import {withRouter} from 'react-router-dom';

import {Card, CardBody, CardHeader} from 'Components/Card';
import {Alert, Loading} from 'Components/Partials';
import {Link} from 'Components/Utilities';

import EmailApi from 'Services/Api/Me/Email';

class Email extends React.Component {
    /**
     * @var state
     * @type {{alert: null, working: boolean}}
     */
    state = {
        working: false,
        alert: null
    };

    /**
     * @method componentDidMount
     * @return {Promise<void>}
     */
    componentDidMount = async () => {
        this.setState({working: true});

        const {params} = this.props.match;
        const request = await EmailApi.update(params.update, params.user, params.token);

        if (request.status === 404) {
            this.setState({
                alert: {
                    type: 'error',
                    message: 'This link is invalid'
                },
                working: false
            });
            return;
        }

        if (request.status !== 200) {
            this.setState({
                alert: {
                    type: 'error',
                    message: request.message
                },
                working: false
            });
            return;
        }

        this.setState({working: false});
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, alert} = this.state;
        const {update} = this.props.match.params;

        return (
            <Unauthenticated>
                <Card>
                    <CardHeader>
                        Email Change
                    </CardHeader>

                    <CardBody>
                        {alert !== null && (<Alert {...alert} />)}

                        {working && (
                            <Loading />
                        )}

                        {!working && !alert && (
                            <p className="text-center">Your email change has been {update === 'reject' ? 'cancelled' : 'completed'}</p>
                        )}
                    </CardBody>
                </Card>

                <p className="text-center mt-4">
                    <Link
                        colour="text-white"
                        to="/login"
                    >Back to login</Link>
                </p>
            </Unauthenticated>
        );
    }
}

export default withRouter(Email);
