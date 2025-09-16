module.exports = {
  attributes: {
    name: { type: 'string' },
    price: { type: 'number' },
    tag: { type: 'string' },
    quantity: { type: 'number', defaultsTo: 0 },
    data: {
      type: 'json',
      columnType: 'object',
      defaultsTo: {}
    }
  },
};
