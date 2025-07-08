
module.exports = {
  friendlyName: 'Set Role for User',
  inputs: {
    id: { type: 'string', required: true },
    rolesList: { type: 'json', required: true },
  },
  fn: async function (inputs, exits) {
    const { id, rolesList } = inputs;
    console.log({ id, rolesList });
    // Validate inputs
    if (!id || !rolesList || !Array.isArray(rolesList)) {
      return exits.badRequest({ message: 'ID and role list are required.' });
    }
    console.log("Set Role 1");
    // Find the user by ID
    const user = await User.findOne({ id });
    if (!user) {
      return exits.notFound({ message: 'User not found.' });
    }
    console.log("Set Role 2");
    // Update the user's roles
    await User.updateOne({ id }).set({ roles: rolesList });
    console.log("Set Role 3");
    return exits.success({ message: 'User roles updated successfully.', userId: id });
  },

}