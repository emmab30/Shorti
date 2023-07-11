'use strict'

const Link = use('App/Models/Link');
const LinkVisits = use('App/Models/LinkVisits');
const View = use('View');
const Env = use('Env');

// Libraries
const { nanoid } = require('nanoid');
const _ = require('lodash');

class HomeController {

    async home({ request, response }) {
        return View.render('home');
    }

    async goToWebApp({ request, response }) {
        response.redirect('https://web.shorti.io', true);
    }
}

module.exports = HomeController