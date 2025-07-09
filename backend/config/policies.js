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
  {'name': 'Toàn quyền sản phẩm', 'action': 'product.*'},
  {'name': 'Xem dữ liệu tổng quan', 'action': 'product.data'},
  {'name': 'Tạo sản phẩm', 'action': 'product.create'},
  {'name': 'Cập nhật sản phẩm', 'action': 'product.update'},
  {'name': 'Xóa sản phẩm', 'action': 'product.delete'},
  {'name': 'Xem danh sách sản phẩm', 'action': 'product.list'},
  {'name': 'Tìm kiếm sản phẩm', 'action': 'product.search'},
  
  {'name': 'Xem danh sách người dùng', 'action': 'user.list'},
  
  {'name': 'Xem danh sách Role', 'action': 'role.list'},
  {'name': 'Tạo Role mới', 'action': 'role.create'},
  {'name': 'Cập nhật Role', 'action': 'role.update'},
  {'name': 'Gán Role cho User', 'action': 'role.setrole'},
  
  {'name': 'Xem danh sách Quyền', 'action': 'perm.list'},
  {'name': 'Tạo Quyền mới', 'action': 'perm.create'}
]

const defaultRoles = [
  []
]
module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
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
