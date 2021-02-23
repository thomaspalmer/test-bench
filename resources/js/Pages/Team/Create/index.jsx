import React from 'react';

import Authenticated from 'Components/Layouts/Authenticated';
import {Alert} from 'Components/Partials';
import {FormHandler, Input} from 'Components/Form';
import {PrimaryButton} from 'Components/Button';

import Teams from 'Services/Api/Teams/Teams';

class Create extends React.Component {
    /**
     * @var success
     * @type {string}
     */
    success = 'Your new team has been created!';

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {form, alert, working, handleInput, handleSubmit} = this.props;

        return (
            <Authenticated>
                <main className="relative -mt-32">
                    <div className="max-w-screen-xl mx-auto pb-6 lg:pb-16">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="divide-y divide-gray-200 lg:divide-y-0 lg:divide-x">
                                <form
                                    className="divide-y divide-gray-200 lg:col-span-9"
                                    onSubmit={(e) => handleSubmit(e, Teams.create, this.success, true)}
                                >
                                    <div className="p-6">
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                                            Create a new team to collaborate with others on projects.
                                        </h2>
                                    </div>

                                    <div className="p-6">
                                        {alert !== null && (<Alert {...alert} />)}

                                        <Input
                                            label="Team Name"
                                            type="text"
                                            value={form.name}
                                            onChange={v => handleInput('name', v)}
                                            id="name"
                                        />
                                    </div>

                                    <div className="p-6 flex justify-end">
                                        <PrimaryButton
                                            text="Create"
                                            working={working}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </Authenticated>
        );
    }
}

export default FormHandler(Create);
