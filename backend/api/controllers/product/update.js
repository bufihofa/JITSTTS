const { buildUpdatePayload, formatRecord, resolveDisplayName } = require('./utils');

module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    products: {
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
    },
    badRequest: {
      description: 'Invalid product data.',
      responseType: 'badRequest',
    }
  },
  fn: async function(inputs, exits) {
    const payloadProducts = this.req.body && _.isArray(this.req.body.products)
      ? this.req.body.products
      : inputs.products;

    if (!_.isArray(payloadProducts) || payloadProducts.length === 0) {
      return exits.badRequest({ message: 'Danh sách sản phẩm không hợp lệ.' });
    }

    const updateProducts = [];
    const failedProducts = [];

    const ids = payloadProducts
      .filter(product => product && product.id)
      .map(product => product.id);

    const existingRecords = await Product.find({ id: ids });
    const existingMap = _.keyBy(existingRecords, 'id');

    for (const payload of payloadProducts) {
      if (!payload || !payload.id) {
        failedProducts.push(payload);
        continue;
      }

      const existing = existingMap[payload.id];

      if (!existing) {
        failedProducts.push(payload);
        continue;
      }

      const updatePayload = buildUpdatePayload(payload, existing);

      if (_.isEmpty(updatePayload)) {
        updateProducts.push(formatRecord(existing));
        continue;
      }

      const updatedRecord = await Product.updateOne({ id: payload.id }).set(updatePayload);

      if (!updatedRecord) {
        failedProducts.push(payload);
        continue;
      }

      updateProducts.push(formatRecord(updatedRecord));
    }

    if (updateProducts.length > 0) {
      const displayNames = updateProducts
        .map(product => resolveDisplayName(product))
        .filter(name => !!name);

      let content = `Đã cập nhật ${updateProducts.length} sản phẩm.`;
      if (displayNames.length === 1) {
        content = `Đã cập nhật sản phẩm "${displayNames[0]}".`;
      }

      Activity.create({
        type: 'update',
        content,
        detail: updateProducts
      })
      .catch(err => {
        console.log('Lỗi:', err);
      });

    }


    return exits.success({ message: 'Update Product OK', finalProducts: updateProducts, failedProducts });
  }
};
