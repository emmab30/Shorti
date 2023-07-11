import { Client, getBaseUrl, encodeQueryData } from './BaseService.js';

var LinkService = {
    generateLink: (data) => {
        return Client().post('/links/generate', data);
    },
    getStatsByHash: (hash) => {
        return Client().get(`/links/hash/${hash}/stats`);
    }
};

export default LinkService;