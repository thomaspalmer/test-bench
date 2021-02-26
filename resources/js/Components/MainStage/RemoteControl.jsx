import React from 'react';

import {PrimaryButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';

import RemoteControlConnect from './Modals/RemoteControlConnect';

export default class RemoteControl extends React.Component {
    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        return (
            <ModalTrigger
                component={RemoteControlConnect}
                props={{
                    sessionId: this.props.sessionId
                }}
            >
                <PrimaryButton
                    text="Launch Remote Control"
                />
            </ModalTrigger>
        );
    }
}
