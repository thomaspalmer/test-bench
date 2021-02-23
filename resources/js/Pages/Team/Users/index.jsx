import React from 'react';

import TeamSettingsPage from '../TeamSettingsPage';
import {PaginationBar, Loading} from 'Components/Partials';
import {DangerButton, PrimaryButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';

import Delete from 'Components/Partials/Modals/Delete';

import Create from './CreateUser';
import Edit from './EditUser';

import UsersApi from 'Services/Api/Teams/Users';
import {Toast, User} from 'Services';

export default class Users extends React.Component {
    /**
     * @var state
     * @type {{working: boolean, users: null}}
     */
    state = {
        working: false,
        users: null
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchUsers();

        UsersApi.on('create', this.fetchUsers);
        UsersApi.on('update', this.fetchUsers);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        UsersApi.removeListener('create', this.fetchUsers);
        UsersApi.removeListener('update', this.fetchUsers);
    };

    /**
     * @method fetchUsers
     * @param {string} page
     * @return {Promise<void>}
     */
    fetchUsers = async (page = 1) => {
        this.setState({working: true});

        const request = await UsersApi.get({team: User.data.active_team_id}, {
            page
        });

        if (request.success) {
            this.setState({
                users: request.data,
                working: false
            });
        }
    };

    /**
     * @method handleDelete
     * @param {object} user
     * @return {Promise<void>}
     */
    handleDelete = async (user) => {
        const request = await UsersApi.delete({
            team: User.data.active_team_id,
            user: user.id
        });

        if (request.success) {
            Toast.success('User has been successfully deleted from your team');

            this.fetchUsers();
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, users} = this.state;

        return (
            <TeamSettingsPage>
                <div
                    className="divide-y divide-gray-200"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Team Users</h2>

                            <ModalTrigger component={Create}>
                                <PrimaryButton text="Create" />
                            </ModalTrigger>
                        </div>
                    </div>

                    <div className="p-6">
                        {working && (
                            <Loading />
                        )}

                        {!working && users && (
                            <ul className="mt-2 divide-y divide-gray-200">
                                {users.data.map(user => (
                                    <li className="py-4 flex items-center justify-between" key={user.id}>
                                        <ModalTrigger
                                            disabled={user.id === User.id}
                                            component={Edit}
                                            props={{
                                                user
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.full_name}<span className="text-teal-500"> &middot; {user.email}</span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Group: {user.teams[0].group.name}
                                                </p>
                                            </div>
                                        </ModalTrigger>

                                        <ModalTrigger
                                            disabled={user.id === User.id}
                                            component={Delete}
                                            props={{
                                                onDelete: () => this.handleDelete(user)
                                            }}
                                        >
                                            <DangerButton text="Remove" disabled={user.id === User.id} />
                                        </ModalTrigger>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-6">
                        {users && (
                            <PaginationBar
                                total={users.meta.total}
                                pageCount={users.meta.last_page}
                                page={users.meta.current_page}
                                goToPage={this.fetchUsers}
                            />
                        )}
                    </div>
                </div>
            </TeamSettingsPage>
        );
    }
}
