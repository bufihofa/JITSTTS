module.exports = {
  friendlyName: 'List Perm',
  fn: async function (inputs, exits) {
    try {
      // Fetch all permissions from the database
      const perms = await Perm.find();
      
      // Check if any permissions were found
      if (!perms || perms.length === 0) {
        return exits.success({ message: 'No permissions found.' });
      }
      
      // Return the list of permissions
      return exits.success({ message: 'Permissions retrieved successfully.', perms });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return exits.error({ message: 'An error occurred while fetching permissions.' });
    }
  },
}