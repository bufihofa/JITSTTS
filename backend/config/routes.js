/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //AUTH
  'POST /api/auth/register':    {action: 'auth/register'},
  'POST /api/auth/login':       {action: 'auth/login'},

  //PRODUCT
  'GET /api/product/list':      {action: 'product/list'},
  'POST /api/product/create':   {action: 'product/create'},
  'PATCH /api/product/update':  {action: 'product/update'},
  'DELETE /api/product/delete': {action: 'product/delete'},

  //USER
  'GET /api/user/list':         {action: 'user/list'},
  'GET /api/user/block/:id':    {action: 'user/block'},
  'GET /api/user/unblock/:id':  {action: 'user/unblock'},
};
