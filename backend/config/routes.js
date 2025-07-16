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

  'POST /api/product':          {action: 'product/create-one'},
  'DELETE /api/product/:id':    {action: 'product/delete-one'},
  'PATCH /api/product/:id':     {action: 'product/update-one'},
  
  'POST /api/product/create':   {action: 'product/create'},
  'DELETE /api/product/delete': {action: 'product/delete'},
  'PATCH /api/product/update':  {action: 'product/update'},
  
  
  //USER
  'GET /api/user/list':         {action: 'user/list'},
  'GET /api/user/search':       {action: 'user/search'},

  //ROLE
  'GET /api/role/list':         {action: 'role/list'},
  'POST /api/role/create':      {action: 'role/create'},
  'PATCH /api/role/update':     {action: 'role/update'},
  'PATCH /api/role/setrole':    {action: 'role/setrole'},
  
  //PERM
  'GET /api/perm/list':         {action: 'perm/list'},
  'POST /api/perm/create':      {action: 'perm/create'},

  //SETTING
  'GET /api/setting/list':      {action: 'setting/list'},
  'POST /api/setting/create':   {action: 'setting/create'},
  'PATCH /api/setting/update':  {action: 'setting/update'},
  'DELETE /api/setting/delete': {action: 'setting/delete'},
  
  'GET /api/setting/fetch': {action: 'setting/fetch'},
  
  'GET /*': { 
    skipAssets: true,
    fn: function(req, res) {
      return res.sendFile(require('path').resolve(sails.config.appPath, 'assets/index.html'));
    }
  }
};
