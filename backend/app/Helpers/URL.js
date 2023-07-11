const axios = require('axios');

class URL {
    static isValid(url) {
        let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        return regex.test(url);
    }

    static async isReachable(url) {
        if(!url) return false;
        else if(url.indexOf('http') == -1) url = `https://${url}`;

        let isValidURL = false;
        try {
            let existsWebsite = await axios.head(url);
            isValidURL = existsWebsite.status <= 400;
        } catch (err) {
            isValidURL = false;
        }

        return isValidURL;
    }
  }
  
  module.exports = URL;