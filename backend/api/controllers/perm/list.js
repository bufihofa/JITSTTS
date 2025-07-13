module.exports = {
  friendlyName: 'List Perm',
  fn: async function (inputs, exits) {
    try {
      const perms = await Perm.find();
      
      if (!perms || perms.length === 0) {
        return exits.success({ message: 'No permissions found.' });
      }
      
      return exits.success({ message: 'Permissions retrieved successfully.', perms });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return exits.error({ message: 'An error occurred while fetching permissions.' });
    }
  },
}