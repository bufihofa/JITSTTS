
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

        const existingRole = await Role.findOne({ id });
        if (!existingRole) {
            return exits.notFound({ message: 'Role not found.' });
        }
        
        console.log('Updating role:', id);
        console.log('Permissions to update:', perms);
        
        if (perms && Array.isArray(perms)) {
            const permIds = perms.map(p => (typeof p === 'object' && p.id) ? p.id : p);
            await Role.updateOne({ id }).set({
                perms: permIds
            });
            global.cache.clear(); 
        }

        return exits.success({ message: 'Role updated successfully.', role: id });
    }
    
    
}