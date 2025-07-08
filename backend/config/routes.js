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

  'GET /api/ping': {action: 'ping'}, 

  //AUTH
  'POST /api/auth/register':    {action: 'auth/register'},
  'POST /api/auth/login':       {action: 'auth/login'},
  'POST /api/auth/google':      {action: 'auth/google'},

  //PRODUCT
  'GET /api/product/search':    {action: 'product/search'},
  'GET /api/product/list':      {action: 'product/list'},
  'POST /api/product/create':   {action: 'product/create'},
  'PATCH /api/product/update':  {action: 'product/update'},
  'DELETE /api/product/delete': {action: 'product/delete'},
  
  'GET /api/product/data':      {action: 'product/data'},
  //USER
  'GET /api/user/list':         {action: 'user/list'},

  //ROLE
  'GET /api/role/list':         {action: 'role/list'},
  'POST /api/role/create':      {action: 'role/create'},
  'PATCH /api/role/update':     {action: 'role/update'},
  'PATCH /api/role/setrole':    {action: 'role/setrole'},
  
  //PERM
  'GET /api/perm/list':         {action: 'perm/list'},
  'POST /api/perm/create':      {action: 'perm/create'},

  'GET /*': { 
    skipAssets: true,
    fn: function(req, res) {
      return res.sendFile(require('path').resolve(sails.config.appPath, 'assets/index.html'));
    }
  }
};
