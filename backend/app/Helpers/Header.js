const _ = require('lodash');

class Header {
    /*
    *   Check if there is any referer based on social media
    */
    static isSocialMediaReferer(referer) {
        const referers = ['facebook', 'twitter'];
        if(referer) {
            return _.some(referers, i => referer.indexOf(i) > -1);
        }

        return false;
    }

    static getSocialReferersPatterns() {
        return [
            'facebook',
            'https://t.co/',
            'whatsapp'
        ];
    }
  }
  
  module.exports = Header;