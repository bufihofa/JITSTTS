const assert = require('assert');

describe('POST /api/product/create (Product Create)', () => {
  let token;

  before(() => {
    token = global.authToken;
    assert.ok(token, 'Missing global authToken.');
  });

  it('should create multiple products including custom fields', async () => {
    const payload = {
      products: [
        {
          name: 'Socola Đen 70%',
          price: 20000,
          quantity: 10,
          tag: 'chocolate',
          shelf: 'A1',
          data: { sku: 'CH-70', flavour: 'Dark' },
        },
        {
          label: 'Trà Xanh Matcha',
          category: 'tea',
          data: { sku: 'TR-01', origin: 'Japan' },
        },
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

    const [firstProduct, secondProduct] = res.body.products;

    assert.strictEqual(firstProduct.shelf, 'A1');
    assert.strictEqual(firstProduct.data.sku, 'CH-70');
    assert.strictEqual(firstProduct.data.flavour, 'Dark');

    assert.ok(secondProduct.id, 'Second product missing id');
    assert.strictEqual(secondProduct.label, 'Trà Xanh Matcha');
    assert.strictEqual(secondProduct.data.origin, 'Japan');
    assert.strictEqual(secondProduct.data.sku, 'TR-01');
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
      data: { shelf: 'A2', calories: 250 },
      supplier: 'Local Bakery',
    };

    const res = await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    assert.strictEqual(res.body.message, 'Create Product OK');
    assert.strictEqual(res.body.products.data.shelf, 'A2');
    assert.strictEqual(res.body.products.data.calories, 250);
    assert.strictEqual(res.body.products.supplier, 'Local Bakery');
  });

  it('should allow creating product with only dynamic fields', async () => {
    const payload = {
      sku: 'SKU-123',
      data: { color: 'red', size: 'M' },
    };

    const res = await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);

    assert.strictEqual(res.body.message, 'Create Product OK');
    assert.strictEqual(res.body.products.sku, 'SKU-123');
    assert.strictEqual(res.body.products.data.color, 'red');
    assert.strictEqual(res.body.products.data.size, 'M');
  });

  it('should reject empty payload', async () => {
    await request
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send({})
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
