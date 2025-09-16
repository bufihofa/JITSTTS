const { formatRecords, resolveDisplayName } = require('./utils');

module.exports = {
  friendlyName: 'Delete',
  inputs: {
    products: {
      description: 'An array of product IDs to delete.',
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
    const productIds = inputs.products;

    const products = await Product.find({
      id: productIds.map(p => p),
    });

    const formattedProducts = formatRecords(products);

    await Product.destroy({
      id: productIds.map(p => p),
    });
    let content = `Đã xóa ${formattedProducts.length} sản phẩm.`;
    if (formattedProducts && formattedProducts.length === 1) {
      const displayName = resolveDisplayName(formattedProducts[0]);
      content = displayName
        ? `Đã xóa sản phẩm "${displayName}".`
        : 'Đã xóa sản phẩm.';
    }
    if (productIds.length > 0) {
      Activity.create({
        type: 'delete',
        content,
        detail: formattedProducts
      })
      .catch(err => {
        console.log('Lỗi:', err);
      });
    }

    return exits.success({ message: 'Xóa sản phẩm thành công.', deletedProducts: formattedProducts });
  }
};
