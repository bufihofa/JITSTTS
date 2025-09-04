
module.exports = function(requiredPerms) {
  if (!Array.isArray(requiredPerms)) {
    requiredPerms = [requiredPerms];
  }

  return async function(req, res, proceed) {
    //console.log('action:', req.options.action);
    if(!requiredPerms || requiredPerms.length === 0) {
      return proceed();
    }
    
    const cacheKey = `user-${req.user.id}`;

    //admin dc bypass
    if(req.user.isAdmin){
      global.cache.set(cacheKey, ['*']);
      req.perms = ['*'];
      return proceed();
    }


    if (!req.user) {
      return res.forbidden('You are not logged in.');
    }

    //neu cache da co
    if (global.cache.has(cacheKey)) {
      const cachedPerms = global.cache.get(cacheKey);

      req.perms = cachedPerms;
      console.log('Using cached permissions for user:', req.user.username);
    }

    //neu chua cache
    else { 
      const [user, role] = await Promise.all([
          await User.findOne({ username: req.user.username }).populate('roles'),
          await Role.find().populate('perms', { select: ['action'] })
      ]);

      const roleIds = user.roles.map(role => role.id);
      const userRoles = role.filter(role => roleIds.includes(role.id));
      const perms = [...new Set(userRoles.flatMap(role => role.perms).flatMap(perm => perm.action))];
      
      global.cache.set(cacheKey, perms);
      req.perms = perms;
    }
    


    const hasPermission = requiredPerms.every(requiredPerm => {
      if (req.perms.includes(requiredPerm)) {
        return true;
      }

      const permParts = requiredPerm.split('.');
      let currentPerm = '';
      for (let i = 0; i < permParts.length - 1; i++) {
        currentPerm += (i > 0 ? '.' : '') + permParts[i];
        const wildcardPerm = `${currentPerm}.*`;
        if (req.perms.includes(wildcardPerm)) {
          return true;
        }
      }
      
      return false;
    });
    
    console.log('Has permission:', hasPermission);

    if( !hasPermission) {
      return res.forbidden('You do not have permission to perform this action.');
    }
    return proceed();
    
  };
};

