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
    const productId = inputs.id;
    
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return exits.notFound({ message: 'Sản phẩm không tồn tại.' });
    }

    await Product.destroyOne({ id: productId });

    // Ghi activity log
    await Activity.create({
      type: 'delete',
      content: `Đã xóa sản phẩm "${product.name}".`,
      detail: product
    }).catch(err => {
      console.log('Lỗi ghi activity:', err);
    });

    return exits.success({ message: 'Xóa sản phẩm thành công.', deletedProduct: product });
  }
};