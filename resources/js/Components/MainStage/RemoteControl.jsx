import React from 'react';

import {PrimaryButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';

import RemoteControlConnect from './Modals/RemoteControlConnect';

export default class RemoteControl extends React.Component {
    render () {
        return (
            <ModalTrigger
                component={RemoteControlConnect}
            >
                <PrimaryButton
                    text="Launch Remote Control"
                />
            </ModalTrigger>
        );
    }
}
