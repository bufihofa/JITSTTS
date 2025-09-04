const assert = require('assert');

describe('POST /api/product/create (Product Create)', () => {
  let token;

  before(() => {
    token = global.authToken;
    assert.ok(token, 'Missing global authToken.');
  });

  it('should create multiple products and return them', async () => {
    const payload = {
      products: [
        { name: 'Socola Đen 70%', price: 20000, quantity: 10, tag: 'chocolate' },
        { name: 'Trà Xanh Matcha', price: 15000, quantity: 5, tag: 'tea' },
      ],
    };

    const res = await request
      .post('/api/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    assert.strictEqual(res.body.message, 'Create Product OK');
    assert.ok(Array.isArray(res.body.products));
    assert.strictEqual(res.body.products.length, 2);
    assert.ok(res.body.products[0].id, 'First product missing id');
    assert.ok(res.body.products[1].id, 'Second product missing id');
  });

  it('should reject invalid payload (validation)', async () => {
    await request
      .post('/api/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        products: [{ name: 123, price: 'x', quantity: 'y', tag: 999 }],
      })
      .expect(400);
  });
});


//##############################################################
describe('POST /api/product (Product Create-one)' , () => {
  let token;
  before(() => {
    token = global.authToken;
    assert.ok(token, 'Missing global authToken.');
  });

  it('should create a single product and return it', async () => {
    const payload = {
      name: 'Bánh Mì',
      price: 15000,
      quantity: 20,
      tag: 'bread',
    };

    const res = await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    assert.strictEqual(res.body.message, 'Create Product OK');
  });

  it('missing name', async () => {
    await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 10000 })
      .expect(400);
  });

  it('invalid price type', async () => {
    await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Product', price: 'not-a-number' })
      .expect(400);
  });
});
