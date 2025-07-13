

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  inputs: {
    name: {
      description: 'The name of the product.',
      type: 'string',
      required: true,
    },
    price: {
      description: 'The price of the product.',
      type: 'number',
      required: false,
      defaultsTo: 0
    },
    quantity: {
      description: 'The quantity of the product.',
      type: 'number',
      required: false,
      defaultsTo: 0
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
  },

  fn: async function (inputs, exits) {

    const done = await Product.create({
      name: inputs.name,
      price: inputs.price,
      quantity: inputs.quantity || 0,
      tag: inputs.tag || ''
    }).fetch();

    content = 'Đã tạo mới sản phẩm "' + done.name + '".';


    if(done) {
      Activity.create({
        type: 'create',
        content: content,
        detail: done
      })
      .catch(err => {
        console.log('Lỗi:', err);
      });
      console.log(content);
    }

    return exits.success({ message: 'Create Product OK', products: done });

  }

};