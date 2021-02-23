import React from 'react';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Authenticated from 'Components/Layouts/Authenticated';

import * as Admin from './Config';

const AdminLayoutNav = (props) => {
    return (
        <NavLink
            to={props.to}
            className="
                group mt-1 border-l-4 border-transparent px-3 py-2 flex items-center
                text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900
            "
            activeClassName="bg-teal-50 border-l-4 border-teal-500"
        >
            <FontAwesomeIcon
                icon={props.icon}
                className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-teal-500 group-hover:text-teal-500"
            />

            <span className="truncate">{props.title}</span>
        </NavLink>
    );
};

/**
 * @function SettingsPage
 * @param {JSX.Element} children
 * @return {JSX.Element}
 * @constructor
 */
const AdminLayout = ({children}) => {
    return (
        <Authenticated pageTitle="Admin">
            <main className="relative -mt-32">
                <div className="max-w-screen-xl mx-auto pb-6 lg:pb-16">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            <aside className="py-6 lg:col-span-3">
                                <nav>
                                    {Object.entries(Admin).map((admin2, i) => {
                                        return admin2[1].map((admin3, i) => {
                                            return (
                                                <AdminLayoutNav
                                                    key={i}
                                                    to={admin3.to}
                                                    icon={admin3.icon}
                                                    title={admin3.title}
                                                />
                                            );
                                        });
                                    })}
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

export default AdminLayout;

