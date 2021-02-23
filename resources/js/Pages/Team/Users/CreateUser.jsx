import React from 'react';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'Components/Modal';
import {FormHandler, Input, Select} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';
import {Alert} from 'Components/Partials';

import Users from 'Services/Api/Teams/Users';
import Groups from 'Services/Api/Teams/Groups';
import {User} from 'Services';

class CreateUser extends React.Component {
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
    success = 'User has been added to your team';

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchGroups();
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
        return Users.post({
            team: User.data.active_team_id
        }, data);
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
                    Create User
                </ModalHeader>

                <form onSubmit={(e) => handleSubmit(e, this.request, this.success, true)}>
                    <ModalBody>
                        {alert !== null && (<Alert {...alert} />)}

                        <Input
                            containerClassName="mb-4"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={v => handleInput('email', v)}
                        />

                        <Select
                            options={groups.map(g => ({value: g.id, label: g.name}))}
                            label="Group"
                            value={form.group_id}
                            onChange={v => handleInput('group_id', v)}
                        />
                    </ModalBody>

                    <ModalFooter alignment="center">
                        <PrimaryButton text="Create" working={working} />
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

export default FormHandler(CreateUser);
