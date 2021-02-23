import ApiBase from '../ApiBase';

class Users extends ApiBase {
    /**
     * @method getUsers
     * @param {object} data
     * @return {Promise<*>}
     */
    getUsers = (data) => {
        return this.get('admin/users', data);
    };

    /**
     * @method storeUser
     * @param {object} data
     * @return {Promise<*>}
     */
    storeUser = (data) => {
        return this.post('admin/users', data);
    }

    /**
     * @method getUser
     * @param {string} id
     * @return {Promise<*>}
     */
    getUser = (id) => {
        return this.get('admin/users/'+id);
    };

    /**
     * @method update
     * @param {string} id
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    updateUser = (id, data) => {
        return this.patch('admin/users/'+id, data);
    };

    /**
     * @method remove
     * @param {string} id
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    deleteUser = (id, data) => {
        return this.delete('admin/users/'+id, 'delete', 204, {
            data
        });
    };
}

export default new Users();
