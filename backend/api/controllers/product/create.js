

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  inputs: {
    
    products: {
        description: 'An array of products to create.',
        required: true,
        type: 'json',
        custom: function(value) {
        if (!_.isArray(value)) {
            return false;
        }
        for (let product of value) {
            if (!_.isObject(product) || 
                !_.isString(product.name) || 
                !_.isNumber(product.price) ||
                !_.isNumber(product.quantity || 0) ||
                (product.tag !== undefined && !_.isString(product.tag))) {
            return false;
            }
        }
        return true;
        }
    }
    
  },
  
  exits: {
    success: {
      description: 'OK.',
    },
  },

  fn: async function (inputs, exits) {

    for (let product of inputs.products) {
      product.owner = this.req.user.id; 
    }
    await Product.createEach(inputs.products);
    return exits.success({ message: 'Create Product OK', products: inputs.products });

  }

};