import React from 'react';
import {Link} from "react-router-dom";

import AdminLayout from '../AdminLayout';
import {Alert, Loading, PaginationBar} from 'Components/Partials';
import {ModalTrigger} from 'Components/Modal';
import Delete from 'Components/Partials/Modals/Delete';
import {PrimaryButton, DangerButton} from 'Components/Button';

import AdminUsersApi from 'Services/Api/Admin/Users';

class UsersIndex extends React.Component {

    state = {
        working: true,
        alert: null,
        users: [],
    };

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = async (page = 1) => {
        this.setState({ 
            working: true,
            alert: null,
        });

        const response = await AdminUsersApi.getUsers({page});

        this.setState({
            working: false,
            users: response.data,
        });
    }

    handleDelete = async (user) => {
        this.setState({ working: true });

        const response = await AdminUsersApi.deleteUser(user.id, {
            confirmed: true
        });

        if (response.status !== 204) {
            this.setState({
                alert: {
                    type: 'error',
                    message: response.message
                },
                working: false
            });
            return;
        }

        this.loadUsers();
    }

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, alert, users} = this.state;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Users
                        </h2>
                    </div>
                </div>

                <div className="ml-4 mr-4 mt-4">
                    <div>
                        <Link to={"/admin/users/store"}>
                            <PrimaryButton
                                text="Click here to add a new User."
                            />
                        </Link>
                    </div>

                    <div className="mt-8">
                        {working && (<Loading />)}

                        {alert !== null && (<Alert {...alert} />)}

                        {!working &&
                            <>
                                { users?.meta?.total == 0 &&
                                    <p>Users will appear here.</p>
                                }

                                { users?.meta?.total != 0 &&
                                    <>
                                        <table className="table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2">First Name</th>
                                                    <th className="px-4 py-2">Last Name</th>
                                                    <th className="px-4 py-2">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { users.data.map((user, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="border px-4 py-2">{user.first_name}</td>
                                                            <td className="border px-4 py-2">{user.last_name}</td>
                                                            <td className="border px-4 py-2">{user.email}</td>
                                                            <td className="border px-4 py-2 text-center flex">
                                                                <Link to={"/admin/users/show/"+user.id}>
                                                                    <PrimaryButton
                                                                        text="View"
                                                                    />
                                                                </Link>

                                                                <Link to={"/admin/users/store/"+user.id}>
                                                                    <PrimaryButton
                                                                        text="Update"
                                                                        className="ml-2"
                                                                    />
                                                                </Link>

                                                                <ModalTrigger
                                                                    component={Delete}
                                                                    props={{
                                                                        itemName: 'user',
                                                                        onDelete: () => this.handleDelete(user)
                                                                    }}
                                                                >
                                                                    <DangerButton
                                                                        text="Delete"
                                                                        className="ml-2"
                                                                    />
                                                                </ModalTrigger>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        {users && (
                                            <div className="mt-12 mb-4">
                                                <PaginationBar
                                                    total={users.meta.total}
                                                    pageCount={users.meta.last_page}
                                                    page={users.meta.current_page}
                                                    goToPage={this.loadUsers}
                                                />
                                            </div>
                                        )}
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
            </AdminLayout>
        )
    }
}

export default UsersIndex;
