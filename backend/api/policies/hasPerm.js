module.exports =  async function(req, res, next) {
    try {
    
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const now = Date.now() 
    const [user, role] = await Promise.all([
    await User.findOne({ username: req.user.username }).populate('roles'),
    await Role.find().populate('perms', { select: ['action'] })
    ]);
    console.log("fetch Time:", Date.now() - now, "ms");
    const roleIds = user.roles.map(role => role.id);
    const userRoles = role.filter(role => roleIds.includes(role.id));
    const perms = userRoles.flatMap(role => role.perms).flatMap(perm => perm.action);
    
    req.perms = perms;
    
    console.log('req.perms', req.perms);

    return next();
    } catch (error) {
    console.error('Error in hasPerm middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
    }
};