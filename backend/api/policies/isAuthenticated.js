const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {
  const { action, subject } = req.options;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header is missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    const user = await User.findOne({ username: payload.username }).populate('roles');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    const roleIds = user.roles.map(role => role.id);
    const permsList = await Role.find({id: roleIds}).populate('perms', {select: ['action']});
    const perms = permsList.flatMap(role => role.perms).flatMap(perm => perm.action);
    req.permsList = perms;
    req.user = user;
    return proceed();
  });
};