const _ = require('@sailshq/lodash');

const BASE_FIELDS = ['name', 'price', 'quantity', 'tag'];
const RESERVED_FIELDS = ['id', 'createdAt', 'updatedAt'];

module.exports = {
  friendlyName: 'Update',
  description: 'Update product details.',
  inputs: {
    products:{
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
    }
  },
  fn: async function(inputs, exits) {
    const products = inputs.products;
    const updateProducts = [];
    const failedProducts = [];

    const ids = products
      .filter(product => _.isPlainObject(product) && product.id)
      .map(product => product.id);

    const existingProducts = await Product.find({ id: ids });
    const existingMap = _.keyBy(existingProducts, 'id');

    for (const product of products) {
      if (!_.isPlainObject(product)) {
        failedProducts.push({ ...product, error: 'Dữ liệu sản phẩm không hợp lệ.' });
        continue;
      }

      if (!product.id) {
        failedProducts.push({ ...product, error: 'Thiếu ID sản phẩm.' });
        continue;
      }

      const existingProduct = existingMap[product.id];
      if (!existingProduct) {
        failedProducts.push({ ...product, error: 'Không tìm thấy sản phẩm.' });
        continue;
      }

      const updatePayload = {};
      let hasInvalidField = false;

      for (const field of BASE_FIELDS) {
        if (!_.isUndefined(product[field])) {
          const value = product[field];
          const validator =
            field === 'price' || field === 'quantity'
              ? _.isNumber
              : _.isString;

          if (!validator(value)) {
            failedProducts.push({ ...product, error: `Trường ${field} không hợp lệ.` });
            hasInvalidField = true;
            break;
          }

          updatePayload[field] = value;
        }
      }

      if (hasInvalidField) {
        continue;
      }

      if (!_.isUndefined(product.data) && !_.isPlainObject(product.data)) {
        failedProducts.push({ ...product, error: 'Dữ liệu cấu hình không hợp lệ.' });
        continue;
      }

      const dynamicData = _.omit(product, [...BASE_FIELDS, 'data', ...RESERVED_FIELDS, 'id']);
      const additionalData = _.isPlainObject(product.data) ? product.data : {};
      let customData = _.assign({}, dynamicData, additionalData);

      if (!_.isEmpty(customData)) {
        const existingData = _.isPlainObject(existingProduct.data) ? existingProduct.data : {};
        customData = _.assign({}, existingData, customData);
        updatePayload.data = customData;
      }

      if (_.isEmpty(updatePayload)) {
        failedProducts.push({ ...product, error: 'Không có dữ liệu nào để cập nhật.' });
        continue;
      }

      const updated = await Product.updateOne({ id: product.id }).set(updatePayload);
      if (updated) {
        const sanitized = _.isFunction(updated.toJSON) ? updated.toJSON() : updated;
        updateProducts.push(sanitized);
      } else {
        failedProducts.push({ ...product, error: 'Không cập nhật được sản phẩm.' });
      }
    }

    if (updateProducts.length > 0) {
        let content = `Đã cập nhật ${updateProducts.length} sản phẩm.`;
        if(updateProducts.length === 1) {
          const updatedProduct = updateProducts[0];
          content = updatedProduct.name
            ? `Đã cập nhật sản phẩm "${updatedProduct.name}".`
            : `Đã cập nhật sản phẩm #${updatedProduct.id}.`;
        }
        Activity.create({
          type: 'update',
          content: content,
          detail: updateProducts
        })
        .catch(err => {
          sails.log.error('Lỗi:', err);
        });

    }


    return exits.success({ message: 'Update Product OK', finalProducts: updateProducts, failedProducts });
  }
}
