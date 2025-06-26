const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {
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

    const user = await User.findOne({ username: payload.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. ADMIN role required.' });
    }
    req.user = user;
    return proceed();
  });
};