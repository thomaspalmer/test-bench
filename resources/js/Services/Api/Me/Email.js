import ApiBase from '../ApiBase';

class Email extends ApiBase {
    /**
     * @method update
     * @param {string} update
     * @param {string} user
     * @param {string} token
     * @return {Promise<*>}
     */
    update = (update, user, token) => {
        return this.post(`me/email/${update}/${user}/${token}`, {}, 'update', 200);
    };
}

export default new Email();
