const { userPermsCache } = require('../../policies/requirePerm');

module.exports = {
  friendlyName: 'Set Role for User',
  inputs: {
    id: { type: 'string', required: true },
    rolesList: { type: 'json', required: true },
  },
  fn: async function (inputs, exits) {
    const { id, rolesList } = inputs;
    // Validate inputs
    if (!id || !rolesList || !Array.isArray(rolesList)) {
      return exits.badRequest({ message: 'ID and role list are required.' });
    }
    // Find the user by ID
    const user = await User.findOne({ id });
    if (!user) {
      return exits.notFound({ message: 'User not found.' });
    }
    // Update the user's roles
    await User.updateOne({ id }).set({ roles: rolesList });
    const cacheKey = `user-${id}`;
    if (userPermsCache.has(cacheKey)) {
        userPermsCache.delete(cacheKey);
        console.log(`Cleared cache for user ${id}`);
    }
    return exits.success({ message: 'User roles updated successfully.', userId: id });
  },

}