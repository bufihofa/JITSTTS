module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    tag: { type: 'string', required: false },
    quantity: { type: 'number', defaultsTo: 0 },

    owner: {
      model: 'user',
      required: true,
    },
  },
};