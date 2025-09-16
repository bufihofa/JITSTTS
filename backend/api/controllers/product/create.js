const _ = require('@sailshq/lodash');

const BASE_FIELDS = ['name', 'price', 'quantity', 'tag'];
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt'];

module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product.',

  inputs: {

    products: {
        description: 'An array of products to create.',
        required: true,
        type: 'json',
        custom: function(value) {
        if (!_.isArray(value)) {
            return false;
        }
        for (let product of value) {
            if (!_.isPlainObject(product)) {
              return false;
            }
        }
        return true;
        }
    }

  },

  exits: {
    success: {
      description: 'OK.',
    },
    badRequest: {
      description: 'Invalid payload.',
      responseType: 'badRequest',
    }
  },

  fn: async function (inputs, exits) {
    const sanitizedProducts = [];

    let index = 0;
    for (const rawProduct of inputs.products) {
      index += 1;
      if (!_.isPlainObject(rawProduct)) {
        return exits.badRequest({ message: `Sản phẩm thứ ${index} không hợp lệ.` });
      }

      const productPayload = {};

      for (const field of BASE_FIELDS) {
        if (!_.isUndefined(rawProduct[field])) {
          const value = rawProduct[field];
          const validator =
            field === 'price' || field === 'quantity'
              ? _.isNumber
              : _.isString;

          if (!validator(value)) {
            return exits.badRequest({ message: `Trường ${field} của sản phẩm thứ ${index} không hợp lệ.` });
          }

          productPayload[field] = value;
        }
      }

      if (!_.isUndefined(rawProduct.data) && !_.isPlainObject(rawProduct.data)) {
        return exits.badRequest({ message: `Dữ liệu cấu hình của sản phẩm thứ ${index} không hợp lệ.` });
      }

      const dynamicData = _.omit(rawProduct, [...BASE_FIELDS, 'data', ...RESERVED_FIELDS]);
      const additionalData = _.isPlainObject(rawProduct.data) ? rawProduct.data : {};
      const customData = _.assign({}, dynamicData, additionalData);

      if (!_.isEmpty(customData)) {
        productPayload.data = customData;
      }

      if (_.isEmpty(productPayload)) {
        return exits.badRequest({ message: `Sản phẩm thứ ${index} không có dữ liệu hợp lệ.` });
      }

      sanitizedProducts.push(productPayload);
    }

    const createdProducts = await Product.createEach(sanitizedProducts).fetch();
    const done = createdProducts.map(product =>
      _.isFunction(product.toJSON) ? product.toJSON() : product
    );

    let content = `Đã tạo mới ${done.length} sản phẩm.`;
    if(done.length === 1) {
      content = done[0].name
        ? `Đã tạo mới sản phẩm "${done[0].name}".`
        : 'Đã tạo mới 1 sản phẩm.';
    }
    if(done.length > 0) {
      Activity.create({
        type: 'create',
        content: content,
        detail: done
      })
      .catch(err => {
        sails.log.error('Lỗi:', err);
      });
    }

    return exits.success({ message: 'Create Product OK', products: done });

  }

};
