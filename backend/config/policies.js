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
  {name: 'Product - *', action: 'product.*'},
  {name: 'Product - Create', action: 'product.create'},
  {name: 'Product - Update', action: 'product.update'},
  {name: 'Product - Delete', action: 'product.delete'},
  {name: 'Product - Search', action: 'product.search'},
  
  {name: 'User - Search', action: 'user.search'},
  
  {name: 'Role - *', action: 'role.*'},
  {name: 'Setting - *', action: 'setting.*'},

  {name: 'Setting - Fetch', action: 'setting.fetch'},
]
const defaultRoles = [
  
  {name: 'Quản lí', desc: 'Người hơi nghèo'},
  {name: 'Nhân viên', desc: 'Người nghèo'}
]

module.exports.defaultRoles = defaultRoles;
module.exports.defaultPermissions = defaultPermissions;
module.exports.policies = {

  '*': true,
  
  'product/create': ['isAuthenticated', requirePerm(['product.create'])],
  'product/create-one': ['isAuthenticated', requirePerm(['product.create'])],

  'product/update': ['isAuthenticated', requirePerm(['product.update'])],
  'product/update-one': ['isAuthenticated', requirePerm(['product.update'])],

  'product/delete': ['isAuthenticated', requirePerm(['product.delete'])],
  'product/delete-one': ['isAuthenticated', requirePerm(['product.delete'])],

  'product/search': ['isAuthenticated', requirePerm(['product.search'])],
  
  'user/list': ['isAuthenticated', requirePerm(['user.list'])],
  'user/search': ['isAuthenticated', requirePerm(['user.search'])],
  


  'role/list': ['isAuthenticated', requirePerm(['role.admin'])],
  'role/create': ['isAuthenticated', requirePerm(['role.admin'])],
  'role/update': ['isAuthenticated', requirePerm(['role.admin'])],
  'role/setrole': ['isAuthenticated', requirePerm(['role.admin'])],

  'perm/list': ['isAuthenticated', requirePerm(['role.admin'])],
  'perm/create': ['isAuthenticated', requirePerm(['role.admin'])],

  'setting/list': ['isAuthenticated', requirePerm(['setting.admin'])],
  'setting/create': ['isAuthenticated', requirePerm(['setting.admin'])],
  'setting/update': ['isAuthenticated', requirePerm(['setting.admin'])],
  'setting/delete': ['isAuthenticated', requirePerm(['setting.admin'])],
  
  'setting/fetch': ['isAuthenticated', requirePerm(['setting.fetch'])],
};

