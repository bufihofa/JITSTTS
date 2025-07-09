
module.exports = {
  friendlyName: 'Delete',
  inputs: {
    products: {
      description: 'An array of product IDs to delete.',
      required: true,
      type: 'json',
      custom: function(value) {
        return _.isArray(value)
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
    const productIds = inputs.products;
    
    const products = await Product.find({
      id: productIds.map(p => p),
    });

    const productsToDelete = await Product.destroy({
      id: productIds.map(p => p),
    });
    let content = `Đã xóa ${products.length} sản phẩm.`;
    if(products && products.length === 1) {
      content = 'Đã xóa sản phẩm "' + products[0].name + '".';
    }
    if(productIds.length > 0) {
      Activity.create({
        type: 'delete',
        content: content,
        detail: products
      })
      .catch(err => {
        console.log('Lỗi:', err);
      });
    }

    return exits.success({ message: 'Xóa sản phẩm thành công.', deletedProducts: products });
  }
}