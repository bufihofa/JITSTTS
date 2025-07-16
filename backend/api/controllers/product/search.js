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
    searchTerm: {
      description: 'Term to search in product name or tag',
      type: 'string',
      defaultsTo: ''
    },
    
    sortBy: {
      description: 'Field to sort by (name, price, quantity, tag)',
      type: 'string',
      defaultsTo: 'name'
    },
    sortDirection: {
      description: 'Sort direction (asc or desc)',
      type: 'string',
      isIn: ['asc', 'desc'],
      defaultsTo: 'asc'
    }
  },

  exits: {
    success: {
      description: 'OK.',
    },
  },
  fn: async function (inputs, exits) {
    const user = this.req.user;
    console.log(inputs);
    let page = Math.max(1, inputs.page);
    let limit = inputs.limit;
    let skip = (page - 1) * limit;

    let criteria = {};
    if (inputs.searchTerm) {
      criteria.or = [
      { name: { 'like': `%${inputs.searchTerm}%` } },
      { tag: { 'like': `%${inputs.searchTerm}%` } }
      ];
    }

    if (inputs.sortBy !== 'name' && inputs.sortBy !== 'price' && inputs.sortBy !== 'quantity' && inputs.sortBy !== 'tag') {
      inputs.sortBy = 'name';
    }
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
    const now = new Date();
    let [totalCount, products] = await Promise.all([
        Product.count(criteria),
        Product.find(criteria)
            .skip(skip)
            .limit(limit)
            .sort([
              { [inputs.sortBy || "id"]: inputs.sortDirection },
              { id: 'ASC' }
            ])
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    if(page > totalPages){
      page = totalPages;
      if(page > 0){
        skip = (page - 1) * limit;
        products = await Product.find(criteria)
          .skip(skip)
          .limit(limit)
          .sort([
            { [inputs.sortBy]: inputs.sortDirection },
            { id: 'ASC' }
          ]);
      }
    }
    console.log("Time to query DB: ", new Date() - now, "ms");
    const hasMore = page < totalPages;
    const hasPrevious = page > 1;

    return exits.success({
      message: 'Find OK',
      data: products,
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