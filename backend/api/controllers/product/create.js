const { buildCreatePayload, formatRecords, resolveDisplayName } = require('./utils');

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  inputs: {

    products: {
      description: 'An array of products to create.',
      required: true,
      type: 'json',
      custom: function (value) {
        return _.isArray(value) && value.every(item => _.isObject(item) && !_.isArray(item));
      }
    }

  },

  exits: {
    success: {
      description: 'OK.',
    },
    badRequest: {
      description: 'Invalid product data.',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs, exits) {
    const payloadProducts = this.req.body && _.isArray(this.req.body.products)
      ? this.req.body.products
      : inputs.products;

    if (!_.isArray(payloadProducts) || payloadProducts.length === 0) {
      return exits.badRequest({ message: 'Danh sách sản phẩm không hợp lệ.' });
    }

    const recordsToCreate = payloadProducts
      .map(product => buildCreatePayload(product))
      .filter(record => !_.isEmpty(record));

    if (recordsToCreate.length === 0) {
      return exits.badRequest({ message: 'Không có sản phẩm hợp lệ để tạo mới.' });
    }

    const createdRecords = await Product.createEach(recordsToCreate).fetch();
    const products = formatRecords(createdRecords);

    let content = `Đã tạo mới ${products.length} sản phẩm.`;
    if (products.length === 1) {
      const displayName = resolveDisplayName(products[0]);
      content = displayName
        ? `Đã tạo mới sản phẩm "${displayName}".`
        : 'Đã tạo mới sản phẩm.';
    }

    if (products.length > 0) {
      Activity.create({
        type: 'create',
        content,
        detail: products
      })
        .catch(err => {
          console.log('Lỗi:', err);
        });
    }

    return exits.success({ message: 'Create Product OK', products });

  }

};
