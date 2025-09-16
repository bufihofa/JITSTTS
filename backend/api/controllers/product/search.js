const { formatRecords } = require('./utils');

module.exports = {
  friendlyName: 'Search Product',

  inputs: {
    page: {
      description: 'Page number for pagination',
      type: 'number',
      defaultsTo: 1
    },
    limit: {
      description: 'Number of items per page',
      type: 'number',
      defaultsTo: 10
    },
    minPrice: {
      description: 'Minimum price filter',
      type: 'number'
    },
    maxPrice: {
      description: 'Maximum price filter',
      type: 'number'
    },
    minQuantity: {
      description: 'Minimum quantity filter',
      type: 'number'
    },
    maxQuantity: {
      description: 'Maximum quantity filter',
      type: 'number'
    },
    searchTerm: {
      description: 'Term to search in product data',
      type: 'string',
      defaultsTo: ''
    },

    sortBy: {
      description: 'Field to sort by',
      type: 'string',
      defaultsTo: 'name'
    },
    sortDirection: {
      description: 'Sort direction (asc or desc)',
      type: 'string',
      isIn: ['ASC', 'DESC', 'asc', 'desc'],
      defaultsTo: 'ASC'
    }
  },

  exits: {
    success: {
      description: 'OK.',
    },
  },
  fn: async function (inputs, exits) {
    let page = Math.max(1, inputs.page || 1);
    let limit = inputs.limit || 10;
    if (!_.isNumber(limit) || limit <= 0) {
      limit = 10;
    }

    const sortKey = inputs.sortBy || 'name';
    const sortDirection = (typeof inputs.sortDirection === 'string' ? inputs.sortDirection.toLowerCase() : 'asc') === 'desc' ? 'desc' : 'asc';

    const criteria = {};

    if (inputs.minPrice !== undefined || inputs.maxPrice !== undefined) {
      criteria.price = {};
      if (inputs.minPrice !== undefined) {
        criteria.price['>='] = inputs.minPrice;
      }
      if (inputs.maxPrice !== undefined) {
        criteria.price['<='] = inputs.maxPrice;
      }
    }

    if (inputs.minQuantity !== undefined || inputs.maxQuantity !== undefined) {
      criteria.quantity = {};
      if (inputs.minQuantity !== undefined) {
        criteria.quantity['>='] = inputs.minQuantity;
      }
      if (inputs.maxQuantity !== undefined) {
        criteria.quantity['<='] = inputs.maxQuantity;
      }
    }

    const rawProducts = await Product.find(criteria);
    let products = formatRecords(rawProducts);

    if (inputs.searchTerm) {
      const term = inputs.searchTerm.toLowerCase();
      products = products.filter((product) => {
        return Object.values(product).some((value) => {
          if (value === null || value === undefined) {
            return false;
          }

          if (_.isObject(value)) {
            return false;
          }

          const compareValue = String(value).toLowerCase();
          return compareValue.includes(term);
        });
      });
    }

    const sortedProducts = _.orderBy(
      products,
      [(item) => {
        const value = _.get(item, sortKey);
        if (value === undefined || value === null) {
          return '';
        }
        if (typeof value === 'string') {
          return value.toLowerCase();
        }
        return value;
      }],
      [sortDirection]
    );

    const totalCount = sortedProducts.length;
    const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / limit);

    if (totalPages > 0 && page > totalPages) {
      page = totalPages;
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + limit);

    const hasMore = totalPages > 0 ? page < totalPages : false;
    const hasPrevious = page > 1;

    return exits.success({
      message: 'Find OK',
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages,
        hasMore,
        hasPrevious
      }
    });

  }
};
