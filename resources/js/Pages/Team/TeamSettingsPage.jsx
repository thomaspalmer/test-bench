import React from 'react';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog, faUsers, faUsersCog} from '@fortawesome/free-solid-svg-icons';

import Authenticated from 'Components/Layouts/Authenticated';

import {User} from 'Services';

/**
 * @function TeamSettingsPage
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const TeamSettingsPage = ({children}) => {
    return (
        <Authenticated pageTitle="Team Settings">
            <main className="relative -mt-32">
                <div className="max-w-screen-xl mx-auto pb-6 lg:pb-16">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            <aside className="py-6 lg:col-span-3">
                                <nav>
                                    <NavLink
                                        to={`/teams/${User.data.active_team.id}/settings`}
                                        className="
                                        group mt-1 border-l-4 border-transparent px-3 py-2 flex items-center
                                        text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900
                                    "
                                        activeClassName="bg-teal-50 border-l-4 border-teal-500"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCog}
                                            className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-teal-500 group-hover:text-teal-500"
                                        />

                                        <span className="truncate">Profile</span>
                                    </NavLink>

                                    <NavLink
                                        to={`/teams/${User.data.active_team.id}/groups`}
                                        className="
                                        group mt-1 border-l-4 border-transparent px-3 py-2 flex items-center
                                        text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900
                                    "
                                        activeClassName="bg-teal-50 border-l-4 border-teal-500"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUsersCog}
                                            className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-teal-500 group-hover:text-teal-500"
                                        />

                                        <span className="truncate">Groups</span>
                                    </NavLink>

                                    <NavLink
                                        to={`/teams/${User.data.active_team.id}/users`}
                                        className="
                                        group mt-1 border-l-4 border-transparent px-3 py-2 flex items-center
                                        text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900
                                    "
                                        activeClassName="bg-teal-50 border-l-4 border-teal-500"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUsers}
                                            className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-teal-500 group-hover:text-teal-500"
                                        />

                                        <span className="truncate">Users</span>
                                    </NavLink>
                                </nav>
                            </aside>

                            <div className="lg:col-span-9">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Authenticated>
    );
};

export default TeamSettingsPage;

