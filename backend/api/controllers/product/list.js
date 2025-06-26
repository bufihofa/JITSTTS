
module.exports = {
  friendlyName: 'List Product',
  description: 'List products',
  inputs: {},
  exits: {
    success: {
      description: 'OK.',
    },
  },
  fn: async function (inputs, exits) {
    const user = this.req.user;
    const products = await Product.find({ owner: user.id });
    return exits.success({ message: 'Find Product OK', products });
  }
};