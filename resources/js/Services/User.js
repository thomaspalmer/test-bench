import {EventEmitter} from 'events';

import Me from './Api/Me/Me';

class User extends EventEmitter {
    /**
     * @var user
     * @type {null|object}
     */
    data = null;

    /**
     * @method loggedIn
     * @return {boolean}
     */
    get loggedIn () {
        return this.data !== null;
    };

    /**
     * @method id
     * @return {string}
     */
    get id () {
        return this.data !== null ? this.data.id : null;
    }

    /**
     * @method refresh
     * @return {Promise<void>}
     */
    refresh = async () => {
        const request = await Me.getMe();

        this.data = request.success ? request.data.data : null;

        this.emit('change');
    };

    /**
     * @method logout
     */
    logout = () => {
        this.emit('change');

        this.data = null;
    };

    /**
     * @method getAvatarUrl
     * @return {string|*}
     */
    getAvatarUrl = () => {
        if (!this.data.avatar_path) {
            return `https://ui-avatars.com/api/?name=${this.data.first_name}&color=7F9CF5&background=EBF4FF`;
        }

        return this.data.avatar_path_url;
    }

    /**
     * @method hasScope
     * @param {array|string} scopes
     * @return {boolean}
     */
    hasScope = (scopes) => {
        scopes = typeof scopes === 'string' ? [scopes] : scopes;

        const scopesMatched = this.data.group.scopes.filter((scope) => {
            if (scopes.indexOf(scope) !== -1) {
                return true;
            } else {
                let matched = false;

                scopes.map(s => {
                    if (s.indexOf('.*') !== -1) {
                        const prefix = s.split('.')[0];
                        const prefixScope = scope.split('.')[0];

                        if (prefix === prefixScope) {
                            matched = true;
                        }
                    }
                });

                return matched;
            }
        });

        return scopesMatched.length !== 0;
    };
}

export default new User;
