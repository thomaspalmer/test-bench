import ApiBase from '../ApiBase';

class Me extends ApiBase {
    /**
     * @method getMe
     * @return {Promise<*>}
     */
    getMe = () => {
        return this.get('me');
    };

    /**
     * @method update
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    update = (data) => {
        return this.patch('me', data, 'update');
    };

    /**
     * @method updatePassword
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    updatePassword = (data) => {
        return this.patch('me/password', data, 'update-password');
    };

    /**
     * @method updateAvatar
     * @param {object} data
     * @return {Promise<boolean|{status: number}|*>}
     */
    updateAvatar = async (data) => {
        const upload = await this.uploadFile(data.file);

        if (upload.status !== 200) {
            return upload;
        }

        return this.patch('me/avatar', {
            key: upload.tempKey,
        }, 'update-avatar');
    };

    /**
     * @method updateTeam
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    updateTeam = (data) => {
        return this.patch('me/team', data, 'update-team');
    };

    /**
     * @method remove
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    remove = (data) => {
        return this.delete('me', 'delete', 204, {
            data
        });
    };
}

export default new Me();
