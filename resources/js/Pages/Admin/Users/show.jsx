import React from 'react';
import {Link} from "react-router-dom";

import AdminLayout from '../AdminLayout';
import {Loading} from 'Components/Partials';
import {PrimaryButton} from 'Components/Button';

import AdminUsersApi from 'Services/Api/Admin/Users';

class UsersShow extends React.Component {

    state = {
        working: true,
        user_id: this.props.match?.params?.user ?? '',
        user: null,
    };

    componentDidMount() {
        this.loadUser();
    }

    loadUser = async (page = 1) => {
        const {user_id} = this.state;

        this.setState({ working: true });

        const response = await AdminUsersApi.getUser(user_id);

        this.setState({
            working: false,
            user: response.data.data,
        });
    }

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, user_id, user} = this.state;

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
                        <Link to={"/admin/users/store/" + user_id}>
                            <PrimaryButton
                                text="Click here to update this User."
                            />
                        </Link>
                    </div>

                    <div className="my-8">
                        {working && (<Loading />)}

                        {!working &&
                            <table className="table-fixed">
                                <tbody>
                                    <tr>
                                        <th className="border px-4 py-2">First Name</th>
                                        <td className="border px-4 py-2">{user.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Last Name</th>
                                        <td className="border px-4 py-2">{user.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Email</th>
                                        <td className="border px-4 py-2">{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Enabled</th>
                                        <td className="border px-4 py-2">{user.enabled ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Admin</th>
                                        <td className="border px-4 py-2">{user.is_admin ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Email Verified</th>
                                        <td className="border px-4 py-2">
                                            {user.email_verified_at_human_readable ?? (user.must_verify_email ? 'No' : 'N/A')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Last Login Date</th>
                                        <td className="border px-4 py-2">{user.last_login_date_human_readable}</td>
                                    </tr>
                                    <tr>
                                        <th className="border px-4 py-2">Created At</th>
                                        <td className="border px-4 py-2">{user.created_at_human_readable}</td>
                                    </tr>
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </AdminLayout>
        )
    }
}

export default UsersShow;