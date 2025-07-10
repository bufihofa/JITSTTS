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
const defaultPermissions = [
  {name: 'Product - *', action: 'product.*', tag: 'default'},
  {name: 'Product - Data', action: 'product.data'},
  {name: 'Product - Create', action: 'product.create'},
  {name: 'Product - Update', action: 'product.update'},
  {name: 'Product - Delete', action: 'product.delete'},
  {name: 'Product - View all', action: 'product.list'},
  {name: 'Product - Search', action: 'product.search'},
  
  {name: 'User - View all', action: 'user.list'},
  
  {name: 'Role - View all', action: 'role.list'},
  {name: 'Role - Create', action: 'role.create'},
  {name: 'Role - Update', action: 'role.update'},
  {name: 'Role - Set Role', action: 'role.setrole'},
  
  {name: 'Permission - View all', action: 'perm.list'},
  {name: 'Permission - Create', action: 'perm.create'}
]
const defaultRoles = [
  {name: 'Nhân viên', desc: 'Người nghèo'},
  {name: 'Quản lí', desc: 'Người hơi nghèo'}
]

module.exports.defaultRoles = defaultRoles;
module.exports.defaultPermissions = defaultPermissions;
module.exports.policies = {

  '*': true,
  'product/data': ['isAuthenticated', requirePerm(['product.data'])],
  
  'product/create': ['isAuthenticated', requirePerm(['product.create'])],
  'product/update': ['isAuthenticated', requirePerm(['product.update'])],
  'product/delete': ['isAuthenticated', requirePerm(['product.delete'])],
  'product/list': ['isAuthenticated', requirePerm(['product.list'])],
  'product/search': ['isAuthenticated', requirePerm(['product.search'])],
  
  'user/list': ['isAuthenticated', requirePerm(['user.list'])],
  'role/list': ['isAuthenticated', requirePerm(['role.list'])],
  'role/create': ['isAuthenticated', requirePerm(['role.create'])],
  'role/update': ['isAuthenticated', requirePerm(['role.update'])],
  'role/setrole': ['isAuthenticated', requirePerm(['role.setrole'])],
  'perm/list': ['isAuthenticated', requirePerm(['perm.list'])],
  'perm/create': ['isAuthenticated', requirePerm(['perm.create'])],

};

