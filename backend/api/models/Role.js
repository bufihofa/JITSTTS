module.exports = {
    attributes: {
        name: { type: 'string', required: true },
        desc: { type: 'string'},

        perms: {
            collection: 'perm',
            via: 'roles',
            dominant: true, 
        },

        users: {
            collection: 'user',
            via: 'roles',
        },

    },
}