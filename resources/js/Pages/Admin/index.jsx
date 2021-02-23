import React from 'react';

import AdminLayout from './AdminLayout';

class AdminIndex extends React.Component {

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        return (
            <AdminLayout>
                <div
                    className="divide-y divide-gray-200 lg:col-span-9"
                >
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Welcome To The Admin Panel
                        </h2>
                    </div>

                    <div className="p-6 block lg:hidden">
                        Click on a link above to begin.
                    </div>

                    <div className="p-6 hidden lg:block">
                        Click on a link on the left side to begin.
                    </div>
                </div>
            </AdminLayout>
        );
    }
}

export default AdminIndex;
