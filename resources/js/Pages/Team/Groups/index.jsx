import React from 'react';

import {Loading, PaginationBar} from 'Components/Partials';
import {DangerButton, PrimaryButton} from 'Components/Button';
import {ModalTrigger} from 'Components/Modal';

import Delete from 'Components/Partials/Modals/Delete';

import TeamSettingsPage from '../TeamSettingsPage';
import Edit from './EditGroup';
import Create from './CreateGroup';

import GroupsApi from 'Services/Api/Teams/Groups';
import {User, Toast} from 'Services';

export default class Groups extends React.Component {
    /**
     * @var state
     * @type {{working: boolean, groups: null}}
     */
    state = {
        working: false,
        groups: null,
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.fetchGroups();

        GroupsApi.on('create', this.fetchGroups);
        GroupsApi.on('update', this.fetchGroups);
    };

    /**
     * @method componentWillUnmount
     */
    componentWillUnmount = () => {
        GroupsApi.removeListener('create', this.fetchGroups);
        GroupsApi.removeListener('update', this.fetchGroups);
    };

    /**
     * @method fetchGroups
     * @param {number} page
     * @return {Promise<void>}
     */
    fetchGroups = async (page = 1) => {
        this.setState({working: true});

        const request = await GroupsApi.get({team: User.data.active_team_id}, {
            page
        });

        if (request.success) {
            this.setState({
                groups: request.data,
                working: false
            });
        }
    };

    /**
     * @method handleDelete
     * @param group
     * @return {Promise<void>}
     */
    handleDelete = async (group) => {
        const request = await GroupsApi.delete({
            team: User.data.active_team_id,
            group: group.id
        });

        if (request.success) {
            Toast.success('Group has been successfully deleted');

            this.fetchGroups();
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {working, groups} = this.state;

        return (
            <TeamSettingsPage>
                <div
                    className="divide-y divide-gray-200"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Team Groups</h2>

                            <ModalTrigger
                                component={Create}
                            >
                                <PrimaryButton
                                    text="Create"
                                />
                            </ModalTrigger>
                        </div>
                    </div>

                    <div className="p-6">
                        {working && (
                            <Loading />
                        )}

                        {!working && groups && (
                            <ul className="mt-2 divide-y divide-gray-200">
                                {groups.data.map(group => (
                                    <li className="py-4 flex items-center justify-between" key={group.id}>
                                        <div className="flex flex-col">
                                            <ModalTrigger
                                                component={Edit}
                                                props={{group}}
                                            >
                                                <p
                                                    className="text-sm font-medium text-gray-900"
                                                >
                                                    {group.name}
                                                </p>
                                            </ModalTrigger>
                                        </div>

                                        <ModalTrigger
                                            disabled={group.user_count !== 0}
                                            component={Delete}
                                            props={{
                                                onDelete: () => this.handleDelete(group)
                                            }}
                                        >
                                            <DangerButton
                                                text="Remove"
                                                disabled={group.user_count !== 0}
                                            />
                                        </ModalTrigger>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-6">
                        {groups && (
                            <PaginationBar
                                total={groups.meta.total}
                                pageCount={groups.meta.last_page}
                                page={groups.meta.current_page}
                                goToPage={this.fetchGroups}
                            />
                        )}
                    </div>
                </div>
            </TeamSettingsPage>
        );
    }
}
