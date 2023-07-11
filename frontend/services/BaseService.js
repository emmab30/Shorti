import axios from 'axios';
import axiosRetry from 'axios-retry';
/* import cookie from 'js-cookie'; */

/** This function configure the Axios library **/

var ENVIRONMENTS = {
    PRODUCTION: 'https://api.shorti.io/api/v1/'
};

var BASE_URL = ENVIRONMENTS.PRODUCTION;

export function Client(timeout = 15000, headers) {

    if(!headers) {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    // Instance the webservice caller
    var api = axios.create({
        baseURL: getBaseUrl(),
        timeout: timeout,
        headers: headers
    });

    // Set the AUTH token for any request
    /* api.interceptors.request.use(function (config) {
        const token = cookie.get('access_token');
        if(token && token != '') {
            config.headers.Authorization =  token ? `Bearer ${token}` : '';
        }

        return config;
    }); */

    axiosRetry(api, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 1000;
        }
    });

    return api;
}

export function getBaseUrl() {
    return BASE_URL;
}

export function encodeQueryData(parameters) {
    let ret = [];
    for (let d in parameters)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(parameters[d]));
    return ret.join('&');
}