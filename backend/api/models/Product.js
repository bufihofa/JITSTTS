const _ = require('@sailshq/lodash');

module.exports = {
  attributes: {
    name: { type: 'string', allowNull: true },
    price: { type: 'number', allowNull: true },
    tag: { type: 'string', allowNull: true },
    quantity: { type: 'number', defaultsTo: 0 },
    data: { type: 'json', columnType: 'object', defaultsTo: {} },

  },

  customToJSON: function () {
    const record = this;
    const sanitizedRecord = _.omit(record, ['data']);

    if (_.isPlainObject(record.data)) {
      return {
        ...sanitizedRecord,
        ...record.data,
        data: record.data,
      };
    }

    return sanitizedRecord;
  },
};
