
module.exports = {
  friendlyName: 'Get Product Data',
  fn: async function (inputs, exits) {
    const user = this.req.user;
    if (!user) {
      return exits.success({ message: 'User not authenticated.' });
    }
    console.log('User 1');
    let [products, activities] = await Promise.all([
        Product.find({ owner: user.id }),
        Activity.find({ owner: user.id }).sort('createdAt DESC').limit(20)
    ]);
    
    const tagCounts = {};

    const LOW_STOCK_THRESHOLD = 10; 

    const lowStockProducts = [];

    products.forEach(product => {
      const tag = product.tag || 'Không phân loại';
        if (product.quantity < LOW_STOCK_THRESHOLD) {
            lowStockProducts.push({
                id: product.id,
                name: product.name,
                quantity: product.quantity,
            });
        }
      if (!tagCounts[tag]) {
        tagCounts[tag] = 0;
      }
      tagCounts[tag]++;
    });
    console.log('User 2');
    const distribution = Object.keys(tagCounts).map(tag => ({
      name: tag,
      value: tagCounts[tag]
    }));
    distribution.sort((a, b) => b.value - a.value); 
    lowStockProducts.sort((a, b) => a.quantity - b.quantity);
    console.log('User 3');

    return exits.success({ message: 'Product data retrieved successfully.', distribution, lowStockProducts, activities });
  }
}