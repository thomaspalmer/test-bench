import React from 'react';

import {PrimaryButton, SecondaryButton} from 'Components/Button';
import {FormHandler, Input} from 'Components/Form';
import {Alert} from 'Components/Partials';

import {User} from 'Services';
import Me from 'Services/Api/Me/Me';

import SettingsPage from '../SettingsPage';

class Avatar extends React.Component {
    /**
     * @var state
     * @type {{file: boolean}}
     */
    state = {
        file: false,
    };

    /**
     * @var success
     * @type {string}
     */
    success = 'Your avatar has been updated successfully';

    /**
     * @var inputRef
     * @type {null|HTMLInputElement}
     */
    inputRef = null;

    /**
     * @method handleOpenInput
     */
    handleOpenInput = () => {
        this.inputRef.click();
    };

    /**
     * @method handleFile
     * @param {File} file
     */
    handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            this.setState({
                file: e.target.result,
            });
        };

        reader.readAsDataURL(file);
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {working, alert, handleInput, handleSubmit} = this.props;
        const {file} = this.state;

        return (
            <SettingsPage>
                <form
                    className="divide-y divide-gray-200 lg:col-span-9"
                    onSubmit={(e) => handleSubmit(e, Me.updateAvatar, this.success)}
                >
                    <div className="p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Avatar</h2>
                    </div>

                    <div className="p-6">
                        {alert !== null && (<Alert {...alert} />)}

                        <Input
                            onChange={(e) => {
                                const f = e.length > 0 ? e[0] : null;

                                handleInput('file', f);
                                this.handleFile(f);
                            }}
                            ref={ref => this.inputRef = ref}
                            type="file"
                            containerClassName="hidden"
                        />

                        <div className="flex items-center">
                            {!file && (
                                <div className="mt-2">
                                    <img
                                        src={User.getAvatarUrl()}
                                        alt={User.data.first_name}
                                        className="rounded-full h-20 w-20 object-cover"
                                    />
                                </div>
                            )}

                            {file && (
                                <div className="mt-2">
                                    <img
                                        src={file}
                                        alt={User.data.first_name}
                                        className="rounded-full h-20 w-20 object-cover"
                                    />
                                </div>
                            )}

                            <SecondaryButton
                                className="ml-2"
                                text="Change"
                                onClick={this.handleOpenInput}
                            />
                        </div>
                    </div>

                    <div className="p-6 flex justify-end">
                        <PrimaryButton
                            text="Save"
                            disabled={!file}
                            working={working}
                        />
                    </div>
                </form>
            </SettingsPage>
        );
    }
}

export default FormHandler(Avatar);
