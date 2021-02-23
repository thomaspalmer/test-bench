import ApiBase from '../ApiBase';

class Teams extends ApiBase {
    /**
     * @method store
     * @param {object} data
     * @return {Promise<*>}
     */
    create = (data) => {
        return this.post('teams', data, 'create');
    };

    /**
     * @method update
     * @param {string} team
     * @param {object} data
     * @return {Promise<boolean|{status: number}>}
     */
    update = (team, data) => {
        return this.patch(`teams/${team}`, data, 'update');
    };
}

export default new Teams();
