import React from 'react';

import AdminLayout from '../AdminLayout';

import {PrimaryButton} from 'Components/Button';
import {FormHandler, Input, Checkbox} from 'Components/Form';
import {Alert, Loading} from 'Components/Partials';

import AdminUsersApi from 'Services/Api/Admin/Users';

class UsersStore extends React.Component {

    /**
     * @var success
     * @type {string}
     */
    success = 'User ' + (this.props.match?.params?.user ? 'updated' : 'created') + ' successfully';

    /**
     * @var state
     * @type {{user_id: string}}
     */
    state = {
        user_id: this.props.match?.params?.user ?? '',
    };

    /**
     * @method componentDidMount
     */
    componentDidMount() {        
        if (this.state.user_id) {
            this.loadUser();
        } else {
            this.props.setForm({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                password_confirmation: '',
                automatically_verify_email: false,
            });
        }
    }

    /**
     * @method loadUser
     * @param {int} page
     */
    loadUser = async (page = 1) => {
        const {user_id} = this.state;

        const response = await AdminUsersApi.getUser(user_id);

        this.props.setForm({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
        });
    }

    /**
     * @method handleSubmit
     * @param {object} form
     * @return {Promise<*>}
     */
    handleSubmit = (form) => {
        const {user_id} = this.state;

        if (user_id) {
            return AdminUsersApi.updateUser(user_id, form);
        } else {
            return AdminUsersApi.storeUser(form);
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() { 
        const {user_id} = this.state;
        const {form, working, alert, handleInput, handleSubmit} = this.props;

        return (
            <AdminLayout>
                <div className="divide-y divide-gray-200 lg:col-span-9">
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Admin Users - {user_id ? 'Update' : 'Create'} User
                        </h2>
                    </div>
                </div>

                <div className="m-4">
                    <form
                        className="divide-y divide-gray-200 lg:col-span-9"
                        onSubmit={(e) => handleSubmit(e, this.handleSubmit, this.success, (user_id ? false : true))}
                    >
                        {alert !== null && (<Alert {...alert} />)}

                        <div className="grid grid-cols-2 gap-4 mb-4 border-0">
                            <div>
                                <Input
                                    label="First Name"
                                    value={form.first_name}
                                    id="first_name"
                                    onChange={(v) => handleInput('first_name', v)}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Last Name"
                                    value={form.last_name}
                                    id="last_name"
                                    onChange={(v) => handleInput('last_name', v)}
                                />
                            </div>

                        { !user_id &&
                            <>
                                <div>
                                    <Input
                                        label="Email"
                                        value={form.email}
                                        id="email"
                                        onChange={(v) => handleInput('email', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={form.password}
                                        id="password"
                                        onChange={v => handleInput('password', v)}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Password Confirmation"
                                        type="password"
                                        value={form.password_confirmation}
                                        id="password_confirmation"
                                        onChange={v => handleInput('password_confirmation', v)}
                                    />
                                </div>

                                {window.base.features.verify_registrations &&
                                    <div className="my-auto">
                                        <Checkbox
                                            label="Automatically Verify Email"
                                            value={form.automatically_verify_email}
                                            id="automatically_verify_email"
                                            onChange={(v) => handleInput('automatically_verify_email', v.target.checked)}
                                        />
                                    </div>
                                }
                            </>
                        } 

                        </div>

                        <div className="p-6 flex justify-end">
                            <PrimaryButton
                                text="Save"
                                working={working}
                            />
                        </div>
                    </form>
                </div>
            </AdminLayout>
        )
    }
}

export default FormHandler(UsersStore);
