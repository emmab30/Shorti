'use strict'

const Link = use('App/Models/Link');
const LinkVisits = use('App/Models/LinkVisits');
const URL = use('App/Helpers/URL');
const Header = use('App/Helpers/Header');
const Env = use('Env');

// Libraries
const { nanoid } = require('nanoid');
const _ = require('lodash');
const axios = require('axios');
const { isBuffer } = require('lodash');
const {Crawler} = require('es6-crawler-detect')

class LinkController {

    async generateLink({ request, response }) {
        const body = request.all();
        var longLink = body.long_link;

        // Normalize URL
        if(!longLink.startsWith('http')) {
            longLink = `https://${longLink}`;
        }

        // Check if link follow URL patterns via regex
        if(!URL.isValid(longLink)) {
            return response.json({
                success: false,
                message: 'The URL is not valid. Fix it and try again.'
            });
        }

        // Check reachability of long link
        const isReachable = await URL.isReachable(longLink);
        if(!isReachable) {
            return response.json({
                success: false,
                message: 'The website is not reachable. Please fix it and try again.'
            });
        }

        // Create the short link
        var shortLink = null;
        var hash = null;

        // Check if there is any link with that long link
        // const existsLongLink = await Link.query().where('long_link', longLink).getCount('id');
        // if(false || existsLongLink > 0) {
        if(false) {
            const longLinkDb = await Link.query().where('long_link', longLink).first();
            hash = longLinkDb.hash;
            shortLink = `${Env.get('BASE_URL')}/${longLinkDb.hash}`;
        } else {
            hash = nanoid(6);
            shortLink = `${Env.get('BASE_URL')}/${hash}`;

            // Generate the URL
            if(hash) {
                await Link.create({
                    long_link: longLink,
                    hash: hash,
                    require_ads: body.require_ads
                })
            }
        }

        return response.json({
            success: true,
            long_link: longLink,
            short_link: shortLink,
            hash: hash
        });
    }

    async renderByHash({ request, response }) {
        const link = await Link
            .query()
            .select(['id', 'long_link'])
            .where('hash', request.params.hash)
            .first();

        if(link){

            // Check if it's crawler or not

            var CrawlerDetector = new Crawler(request.request)
            const headers = request.headers();
            const isCrawler = headers && headers['user-agent'] && CrawlerDetector.isCrawler(headers['user-agent']);

            if(!isCrawler) {
                // Change the referrer if it's via whatsapp
                if(request.params.provider) {
                    if(request.params.provider == 'wp') {
                        headers['referer'] = 'whatsapp';
                    }
                }

                LinkVisits.create({
                    link_id: link.id,
                    referer: headers ? headers['referer'] : null
                });
            }

            response.redirect(link.long_link, true)
            /* const random = _.random(0, 100, false);
            if(random > 80 && link.require_ads) {
                console.log(`Go to ads page`, `https://web.shorti.io/ads?redirect_to=${link.long_link}`);
                response.redirect(`https://web.shorti.io/ads?redirect_to=${link.long_link}`, true)
            } else {
                response.redirect(link.long_link, true)
            } */
        } else {
            response.redirect(Env.get('BASE_URL'));
        }
    }

    async getStatsByHash({ request, response }) {
        const hash = request.params.hash;
        const link = await Link.findBy('hash', hash);
        if(link) {
            const visitsQty = await LinkVisits
                .query()
                .where('link_id', link.id)
                .getCount('id')

            const organicVisits = await LinkVisits.query()
                .where('link_id', link.id)
                .where((query) => {

                    const socialReferers = Header.getSocialReferersPatterns();
                    for(var idx in socialReferers) {
                        query.where('referer', 'NOT LIKE', `%${socialReferers[idx]}%`);
                    }

                    query.orWhereNull('referer');
                })
                .getCount('id');

            const facebookVisits = await LinkVisits.query().where('link_id', link.id).where('referer', 'LIKE', '%facebook%').getCount('id');
            const twitterVisits = await LinkVisits.query().where('link_id', link.id).where('referer', 'LIKE', '%t.co%').getCount('id');
            const whatsappVisits = await LinkVisits.query().where('link_id', link.id).where('referer', 'LIKE', '%whatsapp%').getCount('id');

            return response.json({
                success: true,
                stats: {
                    hash: link.hash,
                    visits: visitsQty,
                    social: {
                        organic: organicVisits,
                        facebook: facebookVisits,
                        twitter: twitterVisits,
                        whatsapp: whatsappVisits
                    }
                },
                link: {
                    long_link: link.long_link,
                    short_link: `https://shorti.io/${link.hash}`
                }
            })
        }

        return response.json({
            success: false,
            message: 'Hash not found'
        });
    }
}

module.exports = LinkController