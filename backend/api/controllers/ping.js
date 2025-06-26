module.exports = {
  friendlyName: 'Ping',
  inputs: {},
  exits: {},
  fn: async function (inputs, exits) {
    return exits.success({ message: 'Pong' });
  }
}