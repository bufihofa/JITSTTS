const { formatRecord, resolveDisplayName } = require('./utils');

module.exports = {
  friendlyName: 'Delete One Product',
  description: 'Delete a single product by ID.',
  inputs: {
    id: {
      description: 'The ID of the product to delete.',
      type: 'string',
      required: true
    }
  },
  exits: {
    success: {
      description: 'Product deleted successfully.',
    },
    notFound: {
      description: 'Product not found.',
      responseType: 'notFound'
    }
  },
  fn: async function(inputs, exits) {
    if (!inputs.id) {
      return exits.notFound({ message: 'ID sản phẩm là bắt buộc.' });
    }
    const productId = inputs.id;

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return exits.notFound({ message: 'Sản phẩm không tồn tại.' });
    }

    const formattedProduct = formatRecord(product);
    await Product.destroyOne({ id: productId });

    const displayName = resolveDisplayName(formattedProduct);
    const content = displayName
      ? `Đã xóa sản phẩm "${displayName}".`
      : 'Đã xóa sản phẩm.';

    // Ghi activity log
    await Activity.create({
      type: 'delete',
      content,
      detail: formattedProduct
    }).catch(err => {
      console.log('Lỗi ghi activity:', err);
    });

    return exits.success({ message: 'Xóa sản phẩm thành công.', deletedProduct: formattedProduct });
  }
};
