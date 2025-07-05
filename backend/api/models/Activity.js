
module.exports = {
    attributes: {
        type: { type: 'string', required: true },
        content: { type: 'string', required: true },
        detail: { type: 'json', required: false },
        createdAt: { type: 'number', autoCreatedAt: true },
        owner: {
            model: 'user',
            required: true,
        },
    },
}