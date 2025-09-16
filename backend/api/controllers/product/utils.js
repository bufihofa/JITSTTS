const _ = require('@sailshq/lodash');

const RESERVED_KEYS = ['id', 'createdAt', 'updatedAt'];
const BASE_FIELDS = ['name', 'price', 'quantity', 'tag'];

function splitPayload(payload) {
  const base = {};
  const dynamic = {};

  if (!_.isObject(payload) || _.isArray(payload)) {
    return { base, dynamic };
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (key === 'data' && _.isObject(value) && !_.isArray(value)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== undefined) {
          dynamic[nestedKey] = nestedValue;
        }
      });
      return;
    }

    if (BASE_FIELDS.includes(key)) {
      base[key] = value;
      return;
    }

    if (RESERVED_KEYS.includes(key)) {
      return;
    }

    dynamic[key] = value;
  });

  return { base, dynamic };
}

function buildCreatePayload(payload) {
  const { base, dynamic } = splitPayload(payload);
  const record = { ...base };
  if (!_.isEmpty(dynamic)) {
    record.data = dynamic;
  }
  return record;
}

function mergeDynamicData(existing = {}, updates = {}) {
  const merged = _.isObject(existing) && !_.isArray(existing) ? _.cloneDeep(existing) : {};

  Object.entries(updates || {}).forEach(([key, value]) => {
    if (value === null) {
      delete merged[key];
      return;
    }

    if (value !== undefined) {
      merged[key] = value;
    }
  });

  return merged;
}

function buildUpdatePayload(payload, existingRecord) {
  const { base, dynamic } = splitPayload(payload);
  const updatePayload = {};

  Object.entries(base).forEach(([key, value]) => {
    if (value !== undefined) {
      updatePayload[key] = value;
    }
  });

  if (existingRecord) {
    const currentData = _.isObject(existingRecord.data) && !_.isArray(existingRecord.data)
      ? existingRecord.data
      : {};

    if (!_.isEmpty(dynamic)) {
      updatePayload.data = mergeDynamicData(currentData, dynamic);
    }
  } else if (!_.isEmpty(dynamic)) {
    updatePayload.data = mergeDynamicData({}, dynamic);
  }

  return updatePayload;
}

function formatRecord(record) {
  if (!record) {
    return record;
  }

  const raw = record.toJSON ? record.toJSON() : record;
  const dynamic = _.isObject(raw.data) && !_.isArray(raw.data) ? raw.data : {};
  const merged = { ...raw, ...dynamic };
  delete merged.data;
  return merged;
}

function formatRecords(records = []) {
  return records.map((record) => formatRecord(record));
}

function resolveDisplayName(record) {
  if (!record) {
    return '';
  }

  const product = record.toJSON ? formatRecord(record) : record;

  if (product.name) {
    return product.name;
  }

  const dynamicNameKey = Object.keys(product).find((key) => {
    if (['id', 'createdAt', 'updatedAt'].includes(key)) {
      return false;
    }
    return key.toLowerCase().includes('name');
  });

  if (dynamicNameKey && product[dynamicNameKey]) {
    return product[dynamicNameKey];
  }

  if (product.title) {
    return product.title;
  }

  if (product.label) {
    return product.label;
  }

  return product.id || '';
}

module.exports = {
  BASE_FIELDS,
  splitPayload,
  buildCreatePayload,
  buildUpdatePayload,
  mergeDynamicData,
  formatRecord,
  formatRecords,
  resolveDisplayName,
};
