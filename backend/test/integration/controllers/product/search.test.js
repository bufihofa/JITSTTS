const assert = require('assert');

describe('GET /api/product/search (Product Search)', () => {
  let token;
  const prefix = `UT-SEARCH-${Date.now()}`;

  before(async () => {
    

    token = global.authToken;
    assert.ok(token, 'Missing global authToken.');

    const seed = {
      products: [
        { name: `${prefix} A`, price: 10000, quantity: 2, tag: 'grp-a' },
        { name: `${prefix} B`, price: 25000, quantity: 15, tag: 'grp-b' },
        { name: `${prefix} C`, price: 20000, quantity: 7, tag: 'grp-c' },
      ],
    };

    const resCreate = await request
      .post('/api/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(seed)
      .expect(200);

    assert.ok(resCreate.body.products && resCreate.body.products.length >= 3);
  });

  it('should search by searchTerm and return paginated data', async () => {
    const res = await request
      .get('/api/product/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10, searchTerm: prefix})
      .expect(200);
    
    assert.ok(Array.isArray(res.body.data), 'Response "data" should be array');
    assert.ok(res.body.data.length >= 3, 'Should include seeded products');
    assert.ok(res.body.pagination);
    assert.strictEqual(res.body.pagination.page, 1);
    assert.strictEqual(res.body.pagination.limit, 10);

    for (const p of res.body.data) {
      assert.ok(
        (p.name && p.name.includes(prefix)) || (p.tag && p.tag.includes(prefix)),
        'Result does not match searchTerm'
      );
    }
  });

  it('sorting by price desc', async () => {
    const res = await request
      .get('/api/product/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 10, searchTerm: prefix, sortBy: 'price', sortDirection: 'desc' })
    const data = res.body.data;
    assert.ok(data.length >= 2, 'Not enough data for sort assertion');
    for (let i = 1; i < data.length; i++) {
      assert.ok(data[i - 1].price >= data[i].price, 'Data is not sorted by price desc');
    }
  });

  it('pagination', async () => {
    const resPage1 = await request
      .get('/api/product/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, limit: 2, searchTerm: prefix, sortBy: 'name', sortDirection: 'asc' })
      .expect(200);

    const resPage2 = await request
      .get('/api/product/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 2, limit: 2, searchTerm: prefix, sortBy: 'name', sortDirection: 'asc' })
      .expect(200);

    assert.strictEqual(resPage1.body.pagination.page, 1);
    assert.strictEqual(resPage2.body.pagination.page, 2);
    assert.strictEqual(resPage1.body.data.length, 2);
    assert.ok(resPage2.body.data.length >= 1);
    assert.ok(resPage1.body.pagination.totalPages >= 2);
  });
});