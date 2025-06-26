
module.exports = {
  friendlyName: 'List Users',
  description: 'List Users',
  inputs: {},
  exits: {
    success: {
      description: 'OK.',
    },
  },
  fn: async function (inputs, exits) {
    const users = await User.find();
    return exits.success({ message: 'Find Users OK', users });
  }
};