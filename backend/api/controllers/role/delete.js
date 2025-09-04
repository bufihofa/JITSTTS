module.exports = {
  friendlyName: 'Delete Role',
    inputs: {
        id: {
            description: 'The ID of the role to delete.',
            type: 'string',
            required: true
        },
    },
    fn: async function (inputs, exits) {
        try {
            const currentRole = await Role.findOne({ id: inputs.id });
            if (!currentRole) {
                return exits.error({ message: 'Role not found.' });
            }
            await Role.destroyOne({ id: inputs.id });

            return exits.success({ message: 'Role deleted successfully.' });
        } catch (error) {
            console.error('Error deleting role:', error);
            return exits.error({ message: 'An error occurred while deleting the role.' });
        }
    }
};