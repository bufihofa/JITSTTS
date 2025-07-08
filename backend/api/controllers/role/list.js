
module.exports = {
    friendlyName: 'List Roles',
    description: 'Retrieve a list of all roles with their permissions and users.',

    fn: async function (inputs, exits) {
        try {
            //const roles = await Role.find().populate('perms').populate('users');
            const roles = await Role.find().populate('perms').populate('users');
            if (!roles || roles.length === 0) {
                return exits.success({ message: 'No roles found.' });
            }
            return exits.success({ message: 'Find OK', roles});
        } catch (error) {
            console.error('Error fetching roles:', error);
            return exits.error({ message: 'An error occurred while fetching roles.' });
        }
    }
};