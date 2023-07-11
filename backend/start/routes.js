'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group('api', () => {
    Route.post(`links/generate`, 'LinkController.generateLink');
    Route.get(`links/hash/:hash`, 'LinkController.getLinkByHash');
    Route.get(`links/hash/:hash/stats`, 'LinkController.getStatsByHash');
}).prefix('api/v1');

Route.get('/', 'HomeController.goToWebApp');

// Links redirection
Route.get(':hash/:provider', 'LinkController.renderByHash');
Route.get(':hash', 'LinkController.renderByHash');