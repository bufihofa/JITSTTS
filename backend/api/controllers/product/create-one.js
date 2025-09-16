const { buildCreatePayload, formatRecord, resolveDisplayName } = require('./utils');

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  exits: {
    success: {
      description: 'OK.',
    },
    badRequest: {
      description: 'Invalid payload.',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs, exits) {
    const payload = this.req.body || {};

    if (!_.isObject(payload) || _.isArray(payload)) {
      return exits.badRequest({ message: 'Dữ liệu sản phẩm không hợp lệ.' });
    }

    const recordToCreate = buildCreatePayload(payload);

    if (_.isEmpty(recordToCreate)) {
      return exits.badRequest({ message: 'Vui lòng cung cấp dữ liệu để tạo sản phẩm.' });
    }

    const createdRecord = await Product.create(recordToCreate).fetch();
    const product = formatRecord(createdRecord);

    const displayName = resolveDisplayName(product);
    const content = displayName
      ? `Đã tạo mới sản phẩm "${displayName}".`
      : 'Đã tạo mới sản phẩm.';

    Activity.create({
      type: 'create',
      content,
      detail: product
    })
      .catch(err => {
        console.log('Lỗi:', err);
      });

    return exits.success({ message: 'Create Product OK', products: product });

  }

};
