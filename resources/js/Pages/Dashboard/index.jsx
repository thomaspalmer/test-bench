import React from 'react';

import Authenticated from 'Components/Layouts/Authenticated';

export default class Dashboard extends React.Component {
    render () {
        return (
            <Authenticated pageTitle="Dashboard">
                <div>Start building something awesome...</div>
            </Authenticated>
        );
    }
}
