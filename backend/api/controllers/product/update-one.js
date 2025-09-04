
module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    id: {
      description: 'The ID of the product to delete.',
      type: 'string',
      required: true
    },
    name: {
      description: 'The name of the product.',
      type: 'string',
      required: false
    },
    price: {
      description: 'The price of the product.',
      type: 'number',
      required: false,
    },
    quantity: {
      description: 'The quantity of the product.',
      type: 'number',
      required: false,
    },
    tag: {
      description: 'The tag of the product.',
      type: 'string',
      required: false,
    }
  },
  exits: {
    success: {
      description: 'OK.',
    },
    failed: {
      description: 'Failed to update product.',
      responseType: 'badRequest'
    }
  },
  fn: async function(inputs, exits) {
    if (!inputs.id) {
      return exits.failed({ message: 'Product ID is required.' });
    }
    const product = {
      id: inputs.id,
      name: inputs.name,
      price: inputs.price,
      quantity: inputs.quantity,
      tag: inputs.tag
    };
    

    
    
    const done = await Product.updateOne({ id: product.id }).set({
      name: product.name,
      price: product.price,
      tag: product.tag,
      quantity: product.quantity
    });

    content = `Đã cập nhật sản phẩm "${done.name}".`;

    Activity.create({ 
      type: 'update',
      content: content,
      detail: done
    })
    .catch(err => {
      console.log('Lỗi:', err);
    });
        


    return exits.success({ message: 'Update Product OK', finalProducts: done});
  }
}