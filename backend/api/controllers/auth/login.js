const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {

  friendlyName: 'Login',

  inputs: {
    username: { type: 'string', required: true},
    password: { type: 'string', required: true}
  },

  exits: {
    success: {
        description: 'Login successful.',
    },
    badRequest: {
        description: 'Invalid login credentials.',
        statusCode: 400,
    },
    },

  fn: async function (inputs, exits) {
    const { username, password } = inputs;

    if (!username || !password) {
      return exits.success({ message: 'Username và password là bắt buộc.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return exits.badRequest({ message: 'Không tồn tại username.' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { username: user.username, email: user.email, isAdmin: user.isAdmin, id: user.id },
          process.env.JWT_SECRET, 
          { expiresIn: '7d' }
        );
        return exits.success({ user: { username: user.username, id: user.id, isAdmin: user.isAdmin}, token });

      } else {
        return exits.badRequest({ message: 'Mật khẩu không đúng.' });
      }
    });
  }

};