import ApiBase from '../ApiBase';

class Imports extends ApiBase {

    /**
     * @method getAvailableImports
     * @return {Promise<*>}
     */
    getAvailableImports = () => {
        return this.get('admin/imports/available-imports');
    }

	/**
     * @method getImports
     * @param {object} data
     * @return {Promise<*>}
     */
    getImports = (data) => {
        return this.get('admin/imports', data);
    }

    /**
     * @method storeImport
     * @param {object} data
     * @return {Promise<*>}
     */
    storeImport = async (data) => {
        const upload = await this.uploadFile(data.file);

        if (upload.status !== 200) {
            return upload;
        }

        return this.post('admin/imports', {
            type: data.type,
            import_file: upload.tempKey,
            import_file_name: data.file.name
        });
    }
}

export default new Imports;