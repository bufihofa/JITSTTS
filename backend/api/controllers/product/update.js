
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
    console.log('finalProducts', finalProducts);
    if (finalProducts.length > 0) {
        const ids = finalProducts.map(p => p.id).join(',');
        const rawQuery = `
            UPDATE product 
            SET 
            name = CASE ${finalProducts.map(p => `WHEN id = ${p.id} THEN '${p.name}'`).join(' ')} END,
            price = CASE ${finalProducts.map(p => `WHEN id = ${p.id} THEN ${p.price}`).join(' ')} END,
            tag = CASE ${finalProducts.map(p => `WHEN id = ${p.id} THEN '${p.tag}'`).join(' ')} END,
            quantity = CASE ${finalProducts.map(p => `WHEN id = ${p.id} THEN ${p.quantity}`).join(' ')} END
            WHERE id IN (${ids}) AND owner = ${user.id}
        `;
        await sails.sendNativeQuery(rawQuery);
    }


    return exits.success({ message: 'Update Product OK', finalProducts, failedProducts });
  }
}