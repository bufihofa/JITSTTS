const _ = require('@sailshq/lodash');

const BASE_FIELDS = ['name', 'price', 'quantity', 'tag'];
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt'];

module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    id: {
      description: 'The ID of the product to delete.',
      type: 'string',
      required: true
    },
    name: {
      description: 'The name of the product.',
      type: 'string',
      required: false
    },
    price: {
      description: 'The price of the product.',
      type: 'number',
      required: false,
    },
    quantity: {
      description: 'The quantity of the product.',
      type: 'number',
      required: false,
    },
    tag: {
      description: 'The tag of the product.',
      type: 'string',
      required: false,
    },
    data: {
      description: 'Dynamic fields configured for the product.',
      type: 'json',
      required: false,
      custom: (value) => _.isPlainObject(value),
    }
  },
  exits: {
    success: {
      description: 'OK.',
    },
    failed: {
      description: 'Failed to update product.',
      responseType: 'badRequest'
    }
  },
  fn: async function(inputs, exits) {
    if (!inputs.id) {
      return exits.failed({ message: 'Product ID is required.' });
    }

    const rawPayload = _.assign({}, inputs || {}, (this.req && this.req.body) || {});

    const existingProduct = await Product.findOne({ id: inputs.id });
    if (!existingProduct) {
      return exits.failed({ message: 'Product not found.' });
    }

    const updatePayload = {};

    for (const field of BASE_FIELDS) {
      if (!_.isUndefined(rawPayload[field])) {
        const value = rawPayload[field];
        const validator =
          field === 'price' || field === 'quantity'
            ? _.isNumber
            : _.isString;

        if (!validator(value)) {
          return exits.failed({ message: `Trường ${field} không hợp lệ.` });
        }

        updatePayload[field] = value;
      }
    }

    if (!_.isUndefined(rawPayload.data) && !_.isPlainObject(rawPayload.data)) {
      return exits.failed({ message: 'Dữ liệu cấu hình sản phẩm không hợp lệ.' });
    }

    const dynamicData = _.omit(rawPayload, [...BASE_FIELDS, 'data', ...RESERVED_FIELDS, 'id']);
    const additionalData = _.isPlainObject(rawPayload.data) ? rawPayload.data : {};

    let customData = _.assign({}, dynamicData, additionalData);

    if (!_.isEmpty(customData)) {
      const existingData = _.isPlainObject(existingProduct.data) ? existingProduct.data : {};
      customData = _.assign({}, existingData, customData);
      updatePayload.data = customData;
    }

    if (_.isEmpty(updatePayload)) {
      return exits.failed({ message: 'Không có dữ liệu nào để cập nhật.' });
    }

    const updated = await Product.updateOne({ id: inputs.id }).set(updatePayload);

    if (!updated) {
      return exits.failed({ message: 'Product not found.' });
    }

    const done = _.isFunction(updated.toJSON) ? updated.toJSON() : updated;

    const content = done.name
      ? `Đã cập nhật sản phẩm "${done.name}".`
      : `Đã cập nhật sản phẩm #${inputs.id}.`;

    Activity.create({
      type: 'update',
      content: content,
      detail: done
    })
    .catch(err => {
      sails.log.error('Lỗi:', err);
    });

    return exits.success({ message: 'Update Product OK', finalProducts: done});
  }
};
