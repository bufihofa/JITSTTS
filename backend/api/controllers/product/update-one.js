const { buildUpdatePayload, formatRecord, resolveDisplayName } = require('./utils');

module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    id: {
      description: 'The ID of the product to update.',
      type: 'string',
      required: true
    }
  },
  exits: {
    success: {
      description: 'OK.',
    },
    failed: {
      description: 'Failed to update product.',
      responseType: 'badRequest'
    },
    badRequest: {
      description: 'Invalid product payload.',
      responseType: 'badRequest',
    }
  },
  fn: async function(inputs, exits) {
    if (!inputs.id) {
      return exits.failed({ message: 'Product ID is required.' });
    }

    const payload = this.req.body || {};

    if (!_.isObject(payload) || _.isArray(payload)) {
      return exits.badRequest({ message: 'Dữ liệu sản phẩm không hợp lệ.' });
    }

    const existing = await Product.findOne({ id: inputs.id });
    if (!existing) {
      return exits.failed({ message: 'Sản phẩm không tồn tại.' });
    }

    const updatePayload = buildUpdatePayload(payload, existing);

    if (_.isEmpty(updatePayload)) {
      const product = formatRecord(existing);
      return exits.success({ message: 'Update Product OK', finalProducts: product });
    }

    const updatedRecord = await Product.updateOne({ id: inputs.id }).set(updatePayload);

    if (!updatedRecord) {
      return exits.failed({ message: 'Không thể cập nhật sản phẩm.' });
    }

    const product = formatRecord(updatedRecord);
    const displayName = resolveDisplayName(product);
    const content = displayName
      ? `Đã cập nhật sản phẩm "${displayName}".`
      : 'Đã cập nhật sản phẩm.';

    Activity.create({
      type: 'update',
      content,
      detail: product
    })
      .catch(err => {
        console.log('Lỗi:', err);
      });

    return exits.success({ message: 'Update Product OK', finalProducts: product });
  }
};
