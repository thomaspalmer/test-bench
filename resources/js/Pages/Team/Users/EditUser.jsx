import React from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {FormHandler, Input, Select} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Alert} from 'Components/Partials';

import Users from 'Services/Api/Teams/Users';
import Groups from 'Services/Api/Teams/Groups';
import {User} from 'Services';

class EditUser extends React.Component {
    /**
     * @var state
     * @type {{groups: []}}
     */
    state = {
        groups: []
    };

    /**
     * @var success
     * @type {string}
     */
    success = 'User has been updated';

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchGroups();

        this.props.setForm({
            group_id: this.props.user.teams[0].group_id
        });
    };

    /**
     * @method fetchGroups
     * @return {Promise<void>}
     */
    fetchGroups = async () => {
        const request = await Groups.get({
            team: User.data.active_team_id
        });

        if (request.success) {
            this.setState({
                groups: request.data.data
            });
        }
    };

    /**
     * @method request
     * @param {object} data
     * @return {Promise<void>}
     */
    request = (data) => {
        return Users.patch({
            team: User.data.active_team_id,
            user: this.props.user.id
        }, data, 'update');
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {form, handleInput, handleSubmit, working, alert} = this.props;
        const {groups} = this.state;

        return (
            <Modal>
                <ModalHeader onClose={this.props.onClose}>
                    Update User
                </ModalHeader>

                <form onSubmit={(e) => handleSubmit(e, this.request, this.success)}>
                    <ModalBody>
                        {alert !== null && (<Alert {...alert} />)}

                        <Select
                            options={groups.map(g => ({value: g.id, label: g.name}))}
                            label="Group"
                            value={form.group_id}
                            onChange={v => handleInput('group_id', v)}
                        />
                    </ModalBody>

                    <ModalFooter alignment="center">
                        <PrimaryButton text="Update" working={working} />
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

export default FormHandler(EditUser);
