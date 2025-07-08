const { userPermsCache } = require('../../policies/requirePerm');

module.exports = {
    friendlyName: 'Update Role',
    
    description: 'Update an existing role.',
    
    inputs: {
        id: {
            type: 'string',
            required: true,
            description: 'The ID of the role to update.'
        },
        perms: {
            type: 'json',
            description: 'An array of permission IDs to associate with the role.',
            required: true
        }
    },
    fn: async function (inputs, exits) {
        const { id, perms } = inputs;
        if (!id || !perms) {
            return exits.badRequest({ message: 'ID are required.' });
        }

        // Check if the role exists
        const existingRole = await Role.findOne({ id });
        if (!existingRole) {
            return exits.notFound({ message: 'Role not found.' });
        }
        

        // Update permissions
        
        if (perms && Array.isArray(perms)) {
            await Role.updateOne({ id }).set({
                perms: perms
            });
            userPermsCache.clear(); 
        }

        return exits.success({ message: 'Role updated successfully.', role: id });
    }
    
    
}