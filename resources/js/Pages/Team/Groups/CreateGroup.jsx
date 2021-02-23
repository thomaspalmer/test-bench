import React from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {FormHandler} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';

import GroupForm from './GroupForm';

import GroupsApi from 'Services/Api/Teams/Groups';
import {User} from 'Services';

class CreateGroup extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'New group has been created.';

    /**
     * @method request
     * @return {Promise<*>}
     */
    request = async (data) => {
        return GroupsApi.post({
            team: User.data.active_team_id
        }, data, 'create');
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {handleSubmit} = this.props;

        return (
            <Modal size="lg">
                <ModalHeader onClose={this.props.onClose}>
                    Create Group
                </ModalHeader>

                <form onSubmit={(e) => handleSubmit(e, this.request, this.success, true)}>
                    <ModalBody>
                        <GroupForm
                            {...this.props}
                        />
                    </ModalBody>

                    <ModalFooter alignment="center">
                        <PrimaryButton
                            text="Create"
                        />
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

export default FormHandler(CreateGroup);
