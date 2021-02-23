import ApiBase from '../ApiBase';

class Reports extends ApiBase {

    /**
     * @method getAvailableReports
     * @return {Promise<*>}
     */
    getAvailableReports = () => {
        return this.get('admin/reports/available-reports');
    }

	/**
     * @method getReports
     * @param {object} data
     * @return {Promise<*>}
     */
	getReports = (data) => {
        return this.get('admin/reports', data);
    }

    /**
     * @method storeReport
     * @param {string} type
     * @return {Promise<*>}
     */
    storeReport = (type) => {
        return this.post('admin/reports', {type});
    }

    /**
     * @method getReport
     * @param {string} id
     * @return {Promise<*>}
     */
    getReport = (id) => {
        return this.get('admin/reports/' + id);
    }
}

export default new Reports;