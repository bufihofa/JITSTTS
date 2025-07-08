/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
const requirePerm = require('../api/policies/requirePerm');

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  '*': true,
  'product/data': ['isAuthenticated', requirePerm(['product-data'])],
  
  'product/create': ['isAuthenticated', requirePerm(['product-create'])],
  'product/update': ['isAuthenticated', requirePerm(['product-update'])],
  'product/delete': ['isAuthenticated', requirePerm(['product-delete'])],
  'product/list': ['isAuthenticated', requirePerm(['product-list'])],
  'product/search': ['isAuthenticated', requirePerm(['product-search'])],
  
};
