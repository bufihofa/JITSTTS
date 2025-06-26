
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
    
    const productsToDelete = await Product.destroy({
      id: productIds.map(p => p),
      owner: user.id
    });
    console.log(productsToDelete);

    return exits.success({ message: 'Xóa sản phẩm thành công.', deletedProducts: productsToDelete });
  }
}