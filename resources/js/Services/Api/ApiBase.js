import axios from 'axios';
import {EventEmitter} from 'events';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import Event from '../Event';
import Toast from '../Toast';

export default class ApiBase extends EventEmitter {
    route = '';

    /**
     * @constructor
     */
    constructor() {
        super();

        let headers = {};

        this.client = axios.create({
            baseURL: process.env.MIX_API_BASE,
            validateStatus: function(status) {
                return status >= 200 && status <= 399; // default
            },
            headers
        });

        // Set CSRF Token.
        const token = this.getCSRFToken();

        if (token) {
            this.client.defaults.headers.common['X-CSRF-TOKEN'] = token
        } else {
            console.error(
                'CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token'
            );
        }

        // Refresh CSRF Token if expired.
        // (https://blog.anasmazouni.dev/solving-laravel-vue-spa-419-token-mismatch/)
        createAuthRefreshInterceptor(this.client, this.refreshCSRFToken, {
            statusCodes: [419],
        });

        // Using a second interceptor to inject the newly fetched CSRF token to all requests
        this.client.interceptors.request.use((request) => {
            request.headers['X-CSRF-TOKEN'] = this.getCSRFToken();
            return request;
        });

        this.client.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if (error.response.status === 401) {
                Event.emit('api-connection-expired');
            } else if (error.response.status >= 500 && error.response.status <= 599) {
                Toast.error();
            }

            return Promise.reject(error);
        });
    };

    /**
     * @method setToken
     * @param {string} token
     * @return {Promise<void>}
     */
    setToken = async token => {
        this.client.defaults.headers["Authorization"] = "Bearer " + token;
    };

    /**
     * @method getCSRFToken
     * @return {string}
     */
    getCSRFToken = () => {
        const token = document.head.querySelector(
            'meta[name="csrf-token"]'
        );

        return token?.content;
    };

    // The following code adds an interceptor that renews the CSRF token whenever
    // the app recieves a token mismatch error
    /**
     * @method refreshCSRFToken
     * @return {Promise<void>}
     */
    refreshCSRFToken = () => {
        return new Promise((resolve, reject) => {
            axios.get('/')
                .then(({ data }) => {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = data;
                    return wrapper
                        .querySelector('meta[name=csrf-token]')
                        ?.getAttribute('content');
                })
                .then((token) => {
                    document
                        .querySelector('meta[name=csrf-token]')
                        ?.setAttribute('content', token || '')
                    resolve();
                })
                .catch(() => reject());
        });
    };

    /**
     * @method get
     * @param {object|string} resource
     * @param {object} data
     * @param {object} config
     * @return {Promise<*>}
     */
    get = async (resource = {}, data = {}, config = {}) => {
        let err = null;

        const response = await this.client.get(this.getResourceUrl(resource) + this.urlParams(data), config)
            .catch(
                (error) => (err = error),
            );

        return this.handleResponse(response, err);
    };

    /**
     * @method post
     * @param {string|object} resource
     * @param {object} data
     * @param {string|null} event
     * @param {number} successStatus
     * @param {object} config
     * @return {Promise<*>}
     */
    post = async (resource, data, event = null, successStatus = 201, config = {}) => {
        let err = null;

        const response = await this.client.post(this.getResourceUrl(resource), data, config).catch(
            (error) => (err = error),
        );

        if (
            event !== undefined && event !== null &&
            this.getStatus(successStatus).indexOf(response.status) !== -1
        ) {
            this.emit(event);
        }

        return this.handleResponse(response, err, successStatus);
    };

    /**
     * @method patch
     * @param {string|object} resource
     * @param {object} data
     * @param {string|null} event
     * @param {number} successStatus
     * @param {object} config
     * @return {Promise<boolean|{status: number}>}
     */
    patch = async (resource, data, event = null, successStatus = 200, config = {}) => {
        let err = null;

        const response = await this.client.patch(this.getResourceUrl(resource), data, config).catch(
            (error) => (err = error),
        );

        if (
            event !== undefined && event !== null &&
            this.getStatus(successStatus).indexOf(response.status) !== -1
        ) {
            this.emit(event);
        }

        return this.handleResponse(response, err);
    };

    /**
     * @method put
     * @param {string|object} resource
     * @param {object} data
     * @param {string|null} event
     * @param {number} successStatus
     * @param {object} config
     * @return {Promise<boolean|{status: number}>}
     */
    put = async (resource, data, event = null, successStatus = 200, config = {}) => {
        let err = null;

        const response = await this.client.put(this.getResourceUrl(resource), data, config).catch(
            (error) => (err = error),
        );

        if (
            event !== undefined && event !== null &&
            this.getStatus(successStatus).indexOf(response.status) !== -1
        ) {
            this.emit(event);
        }

        return this.handleResponse(response, err);
    };

    /**
     * @method delete
     * @param {string|object} resource
     * @param {string|null} event
     * @param {number} successStatus
     * @param {object} config
     * @return {Promise<boolean|{status: number}>}
     */
    delete = async (resource, event, successStatus = 204, config = {}) => {
        let err = null;

        const response = await this.client.delete(this.getResourceUrl(resource), config).catch(
            (error) => (err = error),
        );

        if (event !== undefined && event !== null &&
            response.status === successStatus) {
            this.emit(event);
        }

        return this.handleResponse(response, err);
    };

    /**
     * @method getResourceUrl
     * @param {string|object} resources
     * @return {string}
     */
    getResourceUrl = (resources) => {
        if (resources === null) {
            return this.route;
        }

        if (typeof resources === 'object') {
            let route = this.route;
            const added = [];

            for (let r in resources) {
                const replaceString = `:${r}`;

                if (route.indexOf(replaceString) !== -1) {
                    route = route.replace(replaceString, resources[r]);
                    added.push(resources[r]);
                }
            }

            const resourcesArray = Object.values(resources)
            const lastResource = resourcesArray[resourcesArray.length - 1];

            return `${route}${added.indexOf(lastResource) === -1 ? `/${lastResource}` : ''}`;
        } else {
            if (resources[0] === '/') {
                return resources;
            } else {
                return `${this.route}/${resources}`;
            }
        }
    };

    /**
     * @method getStatus
     * @param {number|number[]} successStatus
     * @return {number[]}
     */
    getStatus = (successStatus) => {
        return !Array.isArray(successStatus) ? [successStatus] : successStatus;
    };

    /**
     * @method urlParams
     * @param {object} params
     * @return {string}
     */
    urlParams = (params) => {
        if (params === undefined || params.length === 0) {
            return '';
        }

        const queryStringItems = [];

        for (const field in params) {
            if (params[field] !== undefined && params[field] !== null &&
                params[field].length !== 0) {
                queryStringItems.push(field + '=' + params[field]);
            }
        }

        return '?' + queryStringItems.join('&');
    };

    /**
     * @method handleResponse
     * @param {object} response
     * @param {object} error
     * @param {number} successStatus
     * @return {boolean|{status: number}}
     */
    handleResponse = (response, error, successStatus = 200) => {
        const status = this.getStatus(successStatus);

        if (status.indexOf(response.status) !== -1) {
            return {
                status: response.status,
                data: response.data,
                success: true
            };
        }

        if (error) {
            return {status: error.response.status, ...error.response.data, success: false};
        }

        return {status: response.status, ...response.data, success: true};
    };

    /**
     * @method requestUpload
     * @param {string} contentType
     * @param {string} visibility
     * @param {array} metadata
     * @return {Promise<*>}
     */
    requestUpload = async (
        contentType,
        visibility = 'public-read',
        metadata) => {
        const request = await this.post('/uploads', {
            content_type: contentType,
            visibility,
            metadata,
        });

        return request.data.data;
    };

    /**
     * @method uploadFile
     * @param {UploadFile|Blob|any} contents
     * @param {string} permission
     * @param {string|null} type
     * @return {Promise<{host: string, tempKey: *, key: *, status: number}|boolean|{status: number}>}
     */
    uploadFile = async (contents, permission = 'public-read', type = null) => {
        const data = {};

        if (contents instanceof File || contents instanceof Blob) {
            type = contents.type;

            if (contents instanceof File) {
                data['OriginalName'] = contents.name;
            }
        }

        const upload = await this.requestUpload(type, permission, data);
        const uploadHeaders = upload.headers;
        const headers = {Host: ''};

        for (const h in uploadHeaders) {
            if (!uploadHeaders.hasOwnProperty(h)) continue;

            if (h === 'Content-Type') {
                headers[h] = uploadHeaders[h];
                continue;
            }

            headers[h] = uploadHeaders[h][0] || '';
        }

        let host = '';
        if ('Host' in uploadHeaders) {
            host = headers.Host;
            delete headers.Host;
        }

        let err;

        const request = await axios.put(upload.url, contents, {
            headers: headers,
        }).catch((e) => err = e);

        if (request.status !== 200) {
            return this.handleResponse(request, err);
        }

        return {
            status: request.status,
            host,
            key: upload.uuid,
            tempKey: upload.key,
        };
    };
}

