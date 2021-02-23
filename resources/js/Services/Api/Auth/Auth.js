import ApiBase from '../ApiBase';

class Auth extends ApiBase {
    /**
     * @method login
     * @param {object} data
     * @return {Promise<*>}
     */
    login = (data) => {
        return this.post('auth/login', data, 'login');
    };

    /**
     * @method register
     * @param {object} data
     * @return {Promise<*>}
     */
    register = (data) => {
        return this.post('auth/register', data, 'register');
    };

    /**
     * @method logout
     * @return {Promise<boolean|{status: number}>}
     */
    logout = () => {
        return this.delete('auth/logout', 'logout');
    };

    /**
     * @method verificationStatus
     * @param {string} user
     * @param {string} token
     * @return {Promise<*>}
     */
    verificationStatus = (user, token) => {
        return this.get(`auth/verify/${user}/${token}`);
    };

    /**
     * @method verify
     * @param {string} user
     * @param {string} token
     * @param {object} data
     * @return {Promise<*>}
     */
    verify = (user, token, data = {}) => {
        return this.post(`auth/verify/${user}/${token}`, data, 'verify');
    };

    /**
     * @method requestPasswordEmail
     * @param {object} data
     * @return {Promise<*>}
     */
    requestPasswordEmail = (data) => {
        return this.post('auth/password/request', data);
    };

    /**
     * @method requestPasswordEmail
     * @param {string} token
     * @param {object} data
     * @return {Promise<*>}
     */
    resetPassword = (token, data) => {
        return this.post(`auth/password/reset/${token}`, data);
    };

    /**
     * @method verifyTwoFactor
     * @param {object} data
     * @return {Promise<*>}
     */
    verifyTwoFactor = (data) => {
        return this.post('auth/two-factor', data, 'two-factor');
    };
}

export default new Auth();
