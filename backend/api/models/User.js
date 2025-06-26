const bcrypt = require('bcryptjs');

module.exports = {
  attributes: {
    username: { type: 'string', required: true, unique: true },
    email: { type: 'string', required: true, unique: true, isEmail: true },
    password: { type: 'string', required: true },
    isBlocked: { type: 'boolean', defaultsTo: false },
    role: {
      type: 'string',
      isIn: ['admin', 'user'],
      defaultsTo: 'user',
    },
  },

  
  beforeCreate: function (valuesToSet, proceed) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return proceed(err);
      bcrypt.hash(valuesToSet.password, salt, (err, hash) => {
        if (err) return proceed(err);
        valuesToSet.password = hash;
        return proceed();
      });
    });
  },
};

