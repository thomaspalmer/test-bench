import ApiBase from '../ApiBase';

class TwoFactor extends ApiBase {
    route = '/me/two-factor';

    /**
     * @method enable
     * @return {Promise<*>}
     */
    enable = () => {
        return this.post(`authentication`, {}, 'enable');
    };

    /**
     * @method disable
     * @return {Promise<boolean|{status: number}>}
     */
    disable = () => {
        return this.delete(`authentication`, 'disable');
    };

    /**
     * @method qrCode
     * @return {Promise<*>}
     */
    qrCode = () => {
        return this.get(`qr-code`);
    };

    /**
     * @method recoveryCodes
     * @return {Promise<*>}
     */
    recoveryCodes = () => {
        return this.get(`recovery-codes`);
    };

    /**
     * @method createRecoveryCodes
     * @return {Promise<*>}
     */
    createRecoveryCodes = () => {
        return this.post(`recovery-codes`, {}, 'create-recovery-codes');
    };
}

export default new TwoFactor();
