
module.exports = function(requiredPerms) {
  if (!Array.isArray(requiredPerms)) {
    requiredPerms = [requiredPerms];
  }

  return async function(req, res, proceed) {
    if(!requiredPerms || requiredPerms.length === 0) {
      return proceed();
    }

    console.log("action: ", req.options.action);
    console.log("requiredPerms: ", requiredPerms);
    if (!req.user) {
      return res.forbidden('You are not logged in.');
    }

    const [user, role] = await Promise.all([
        await User.findOne({ username: req.user.username }).populate('roles'),
        await Role.find().populate('perms', { select: ['action'] })
    ]);

    const roleIds = user.roles.map(role => role.id);
    const userRoles = role.filter(role => roleIds.includes(role.id));
    const perms = userRoles.flatMap(role => role.perms).flatMap(perm => perm.action);
    
    req.perms = perms;
    
    console.log('userPerms', req.perms);
    return proceed();
    
  };
};