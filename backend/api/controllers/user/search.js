module.exports = {
  friendlyName: 'Search User',
  
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
      description: 'Field to sort by',
      type: 'string',
      defaultsTo: 'username'
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
    let page = Math.max(1, inputs.page);
    let limit = inputs.limit;
    let skip = (page - 1) * limit;

    let criteria = {};

    if (inputs.searchTerm) {
        criteria.or = [
          { name: { contains: inputs.searchTerm } }
        ];
    }

   
    const now = new Date();
    let [totalCount, products] = await Promise.all([
        User.count(criteria),
        User.find(criteria)
            .skip(skip)
            .limit(limit)
            .sort([
              { [inputs.sortBy]: inputs.sortDirection },
              { id: 'ASC' }
            ])
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    if(page > totalPages){
      page = totalPages;
      if(page > 0){
        skip = (page - 1) * limit;
        products = await User.find(criteria)
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
      message: 'Find Product OK',
      test: this.req.permsList,
      products,
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