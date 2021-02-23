import React from 'react';

import {Loading} from 'Components/Partials';

import Auth from 'Services/Api/Auth/Auth';

export default class Logout extends React.Component {
    /**
     * @method componentDidMount
     * @return {Promise<void>}
     */
    componentDidMount = async () => {
        await Auth.logout();
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        return (
            <div className="flex just-center items-center h-screen w-screen">
                <Loading />
            </div>
        );
    }
}
