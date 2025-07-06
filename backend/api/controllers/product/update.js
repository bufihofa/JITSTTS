
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
    const user = this.req.user;
    const products = inputs.products;
    const updateProducts = [];
    const failedProducts = [];

    for (let product of products) {
      if (!product.id) failedProducts.push(product);
      else
      {
        const newProduct = {
            id: product.id,
            owner: user.id, 
        };

        if (product.name !== undefined) newProduct.name = product.name;
          if (product.price !== undefined) newProduct.price = product.price;
          if (product.tag !== undefined) newProduct.tag = product.tag;
          if (product.quantity !== undefined) newProduct.quantity = product.quantity;
        
        updateProducts.push(newProduct);
      }
    }
    //get all products by ids
    const existingProducts = await Product.find({ 
      id: updateProducts.map(p => p.id), 
      owner: user.id 
    });
    const finalProducts = [];

    //update existingProducts to updateProducts
    
    for (let updateProduct of updateProducts) {
        const existingProduct = existingProducts.find(p => p.id === updateProduct.id);
        if (!existingProduct) {
            failedProducts.push(updateProduct);
            continue;
        }
        finalProducts.push({
            ...existingProduct,
            ...updateProduct
        });
    }
    //update
    if (finalProducts.length > 0) {
        await Promise.all(finalProducts.map(product => 
          Product.updateOne({ id: product.id }).set({
            name: product.name,
            price: product.price,
            tag: product.tag,
            quantity: product.quantity
          })
        ));

        let content = `Đã cập nhật ${finalProducts.length} sản phẩm.`;
        if(finalProducts.length === 1) {
          content = `Đã cập nhật sản phẩm "${finalProducts[0].name}".`;
        }
        Activity.create({ 
          type: 'update',
          owner: this.req.user.id,
          content: content,
          detail: finalProducts,
          oldDetail: existingProducts
        })
        .catch(err => {
          console.log('Lỗi:', err);
        });
        
    }


    return exits.success({ message: 'Update Product OK', finalProducts, failedProducts });
  }
}