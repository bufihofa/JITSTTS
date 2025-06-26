const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Register',

  inputs: {
    username: { type: 'string', required: true},
    email: { type: 'string', required: true, isEmail: true },
    password: { type: 'string', required: true}
  },

  exits: {
    success: {
        description: 'Register successful.',
    },
    badRequest: {
        description: 'Invalid register credentials.',
    },
    },

  fn: async function (inputs, exits) {
    console.log(inputs);
    const { username, email, password } = inputs;

    if (!username || !email || !password) {
      return exits.success({ message: 'Không được bỏ trống thông tin.' });
    }

    const existingUser = await User.findOne().where({ 
      or: [
      { username: username },
      { email: email }
      ]
    });

    if (existingUser) {
      if (existingUser.username === username) {
      return exits.badRequest({ message: 'Username đã tồn tại.' });
      }
      if (existingUser.email === email) {
      return exits.badRequest({ message: 'Email đã tồn tại.' });
      }
    }

    let role = 'user'; 
    if (email === process.env.ADMIN_EMAIL) {
      role = 'admin'; 
    }
    const newUser = await User.create({ username, email, password, role }).fetch();
    if (!newUser) {
      return exits.badRequest({ message: 'Đăng ký không thành công.' });
    }

    const token = jwt.sign(
      { username: newUser.username, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    return exits.success({ user: { username: newUser.username, role: newUser.role }, token });
    
  }
    

};