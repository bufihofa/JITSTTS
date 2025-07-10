module.exports = {
    attributes: {
        name: { type: 'string', required: true },
        action: { type: 'string', required: true },
        tag: { type: 'string', required: false },
        roles: {
            collection: 'role',
            via: 'perms',
        }
    }
}