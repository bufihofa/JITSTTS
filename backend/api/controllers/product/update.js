
module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    products:{
        description: 'An array of products to update.',
        required: true,
        type: 'json',
        custom: function(value) {
            return _.isArray(value);
        }
    }
  },
  exits: {
    success: {
      description: 'OK.',
    }
  },
  fn: async function(inputs, exits) {
    const products = inputs.products;
    const updateProducts = [];
    const failedProducts = [];

    for (let product of products) {
      if (!product.id) failedProducts.push(product);
      else
      {
        const newProduct = {
            id: product.id
        };

        if (product.name !== undefined) newProduct.name = product.name;
        if (product.price !== undefined) newProduct.price = product.price;
        if (product.tag !== undefined) newProduct.tag = product.tag;
        if (product.quantity !== undefined) newProduct.quantity = product.quantity;
        
        updateProducts.push(newProduct);
      }
    }
    

    
    
    //update
    if (updateProducts.length > 0) {
        await Promise.all(updateProducts.map(product => 
          Product.updateOne({ id: product.id }).set({
            name: product.name,
            price: product.price,
            tag: product.tag,
            quantity: product.quantity
          })
        ));

        let content = `Đã cập nhật ${updateProducts.length} sản phẩm.`;
        if(updateProducts.length === 1) {
          content = `Đã cập nhật sản phẩm "${updateProducts[0].name}".`;
        }
        Activity.create({ 
          type: 'update',
          content: content,
          detail: updateProducts
        })
        .catch(err => {
          console.log('Lỗi:', err);
        });
        
    }


    return exits.success({ message: 'Update Product OK', finalProducts: updateProducts, failedProducts });
  }
}