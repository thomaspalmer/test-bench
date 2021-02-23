import React from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {PrimaryButton} from 'Components/Button';
import {FormHandler} from 'Components/Form';

import GroupForm from './GroupForm';

import GroupsApi from 'Services/Api/Teams/Groups';

class EditGroup extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'The groups settings have been updated';

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.props.setForm({
            ...this.props.group
        });
    };

    /**
     * @method request
     * @param {object} data
     * @return {Promise<boolean|{status: number}>|Promise<AxiosResponse<any>>}
     */
    request = (data) => {
        const {group} = this.props;

        return GroupsApi.patch({
            team: group.team_id,
            group: group.id
        }, data, 'update');
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {handleSubmit} = this.props;

        return (
            <Modal size="lg">
                <ModalHeader onClose={this.props.onClose}>
                    Edit Group
                </ModalHeader>

                <form onSubmit={(e) => handleSubmit(e, this.request, this.success)}>
                    <ModalBody>
                        <GroupForm
                            {...this.props}
                        />
                    </ModalBody>

                    <ModalFooter alignment="center">
                        <PrimaryButton
                            text="Update"
                        />
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

export default FormHandler(EditGroup);
