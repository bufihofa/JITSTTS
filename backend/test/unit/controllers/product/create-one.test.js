const assert = require('assert');
const createOne = require('../../../../api/controllers/product/create-one');
describe('- product/create-one', () => {
    console.log("Running product/create-one tests...");
    it("should success with dynamic data", async () => {
        const mockBody = {
            name: 'Test Product',
            price: 10000,
            quantity: 50,
            tag: 'test',
            data: { sku: 'SKU-001' },
            shelf: 'A1'
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };
        await createOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.products, 'Missing products in response data');
        assert.strictEqual(result.data.products.name, mockBody.name, 'Product name mismatch');
        assert.strictEqual(result.data.products.price, mockBody.price, 'Product price mismatch');
        assert.strictEqual(result.data.products.quantity, mockBody.quantity, 'Product quantity mismatch');
        assert.strictEqual(result.data.products.tag, mockBody.tag, 'Product tag mismatch');
        assert.strictEqual(result.data.products.shelf, mockBody.shelf, 'Custom field mismatch');
        assert.strictEqual(result.data.products.data.sku, mockBody.data.sku, 'Custom data mismatch');

        await Product.destroy({ });
    });

    it("should fail on empty payload", async () => {
        const mockBody = {};

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };

        await createOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);

        await Product.destroy({ });
    });

    it("should fail on invalid price", async () => {
        const mockBody = {
            name: 'Invalid price',
            price: 'abc'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };

        await createOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);

        await Product.destroy({ });
    });
});
