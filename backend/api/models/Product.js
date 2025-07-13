module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    price: { type: 'number'},
    tag: { type: 'string' },
    quantity: { type: 'number', defaultsTo: 0 },

    
  },
};