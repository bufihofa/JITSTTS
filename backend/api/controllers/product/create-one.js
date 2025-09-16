const _ = require('@sailshq/lodash');

const BASE_FIELDS = ['name', 'price', 'quantity', 'tag'];
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt'];

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  inputs: {
    name: {
      description: 'The name of the product.',
      type: 'string',
      required: false,
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
    },

  },

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
    const rawPayload = _.assign({}, inputs || {}, (this.req && this.req.body) || {});

    const productPayload = {};

    for (const field of BASE_FIELDS) {
      if (!_.isUndefined(rawPayload[field])) {
        const value = rawPayload[field];
        const validator =
          field === 'price' || field === 'quantity'
            ? _.isNumber
            : _.isString;

        if (!validator(value)) {
          return exits.badRequest({ message: `Trường ${field} không hợp lệ.` });
        }

        productPayload[field] = value;
      }
    }

    if (!_.isUndefined(rawPayload.data) && !_.isPlainObject(rawPayload.data)) {
      return exits.badRequest({ message: 'Dữ liệu cấu hình sản phẩm không hợp lệ.' });
    }

    const dynamicData = _.omit(rawPayload, [...BASE_FIELDS, 'data', ...RESERVED_FIELDS]);
    const additionalData = _.isPlainObject(rawPayload.data) ? rawPayload.data : {};

    const customData = _.assign({}, dynamicData, additionalData);

    if (!_.isEmpty(customData)) {
      productPayload.data = customData;
    }

    if (_.isEmpty(productPayload)) {
      return exits.badRequest({ message: 'Không có dữ liệu sản phẩm hợp lệ.' });
    }

    const created = await Product.create(productPayload).fetch();
    const done = created && _.isFunction(created.toJSON) ? created.toJSON() : created;

    const content = done.name
      ? `Đã tạo mới sản phẩm "${done.name}".`
      : 'Đã tạo mới sản phẩm mới.';

    if (done) {
      Activity.create({
        type: 'create',
        content,
        detail: done,
      }).catch(err => {
        sails.log.error('Lỗi:', err);
      });
    }

    return exits.success({ message: 'Create Product OK', products: done });

  }

};
