import React from 'react';

import Unauthenticated from 'Components/Layouts/Unauthenticated';
import {DangerButton} from 'Components/Button';

export default class Splash extends React.Component {
    /**
     * @method render
     * @return {*}
     */
    render () {
        return (
            <Unauthenticated>
                <div>
                    Welcome
                </div>
            </Unauthenticated>
        );
    }
}
