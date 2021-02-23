import React from 'react';

import {Input, Label} from 'Components/Form';
import {Alert} from 'Components/Partials';

export default class GroupForm extends React.Component {
    /**
     * @var state
     * @type {{scopes: {}}}
     */
    state = {
        scopes: {}
    };

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        const scopes = {};

        window.base.scopes.forEach((scope) => {
            const parts = scope.split('.');

            if (scopes[parts[0]] === undefined) {
                scopes[parts[0]] = [];
            }

            scopes[parts[0]].push({
                scope,
                permission: parts[1]
            });
        });

        this.setState({
            scopes
        });
    };

    /**
     * @method handleCheck
     * @param {string} id
     */
    handleCheck = (id) => {
        const scopes = [...this.props.form.scopes ?? []];
        const index = scopes.indexOf(id);

        if (index === -1) {
            scopes.push(id);
        } else {
            scopes.splice(index, 1);
        }

        this.props.handleInput('scopes', scopes);
    };

    /**
     * @method handleAll
     * @param {string} key
     */
    handleAll = (key) => {
        if (this.state.scopes[key] === undefined) {
            return;
        }

        const scopes = [...this.props.form.scopes ?? []];
        const changeScopes = this.state.scopes[key].map((scope) => scope.scope);
        const removing = changeScopes.filter((x) => scopes.includes(x)).length === changeScopes.length;

        changeScopes.forEach((scope) => {
            if (removing) {
                const index = scopes.indexOf(scope);

                if (index !== -1) {
                    scopes.splice(index, 1);
                }
            } else {
                if (scopes.indexOf(scope) === -1) {
                    scopes.push(scope);
                }
            }
        });

        this.props.handleInput('scopes', scopes);
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {form, alert, handleInput} = this.props;

        return (
            <React.Fragment>
                {alert && (<Alert {...alert} />)}

                <Input
                    containerClassName="mb-4"
                    value={form.name}
                    label="Name"
                    onChange={(v) => handleInput('name', v)}
                />

                <div>
                    <Label label="Scopes/Permissions" />

                    {this.renderScopes()}
                </div>
            </React.Fragment>
        );
    }

    /**
     * @method renderScopes
     * @return {[]}
     */
    renderScopes = () => {
        const {scopes} = this.state;
        const {scopes: checked = []} = this.props.form;
        const scopeBody = [];

        for (const key in scopes) {
            const name = key.replace('-', ' ');

            scopeBody.push(
                <React.Fragment key={key}>
                    <div className="flex justify-between">
                        <h3 className="text-md leading-6 font-medium text-gray-900 capitalize mr-2">
                            {name}
                        </h3>

                        <div onClick={() => this.handleAll(key)} className="cursor-pointer text-teal-500">All</div>
                    </div>

                    <div className="grid gap-5 max-w-lg mx-auto lg:grid-cols-4 lg:max-w-none pt-2 pb-4">
                        {scopes[key].map((scope) => (
                            <div key={scope.scope} className="relative flex items-start">
                                <input
                                    id={scope.scope}
                                    type="checkbox"
                                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-2 rounded"
                                    checked={checked.indexOf(scope.scope) !== -1}
                                    onChange={() => this.handleCheck(scope.scope)}
                                />
                                <Label
                                    htmlFor={scope.scope}
                                    label={scope.permission.replace('-', ' ')}
                                    className="capitalize"
                                />
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            );
        }

        return scopeBody;
    }
}
