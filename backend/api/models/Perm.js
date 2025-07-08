module.exports = {
    attributes: {
        name: { type: 'string', required: true },
        action: { type: 'string', required: true },

        roles: {
            collection: 'role',
            via: 'perms',
        }
    }
}