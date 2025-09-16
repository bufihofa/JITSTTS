const assert = require('assert');
const updateOne = require('../../../../api/controllers/product/update-one');

describe('- product/update-one', () => {
    it("should success", async () => {
        const createdProduct = await Product.create({
            name: 'Initial Product',
            price: 5000,
            quantity: 30,
            tag: 'initial',
            data: { sku: 'SKU-INIT' },
            shelf: 'A1'
        }).fetch();

        const mockBody = {
            id: createdProduct.id,
            name: 'Updated Product',
            price: 8000,
            quantity: 25,
            tag: 'updated',
            data: { sku: 'SKU-UPDATED' },
            shelf: 'B2'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            failed: (data) => { result.exit = 'failed'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };

        await updateOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.finalProducts, 'Missing products in response data');
        assert.strictEqual(result.data.finalProducts.name, mockBody.name, 'Product name mismatch');
        assert.strictEqual(result.data.finalProducts.price, mockBody.price, 'Product price mismatch');
        assert.strictEqual(result.data.finalProducts.quantity, mockBody.quantity, 'Product quantity mismatch');
        assert.strictEqual(result.data.finalProducts.tag, mockBody.tag, 'Product tag mismatch');
        assert.strictEqual(result.data.finalProducts.shelf, mockBody.shelf, 'Custom field mismatch');
        assert.strictEqual(result.data.finalProducts.data.sku, mockBody.data.sku, 'Custom data mismatch');

        await Product.destroy({ });
    });

    it("should fail on missing id", async () => {
        const mockBody = {
            name: 'Product',
            price: 8000,
            quantity: 25,
            tag: 'asd'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            failed: (data) => { result.exit = 'failed'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };

        await updateOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'failed', `Expected exit 'failed' but got '${result.exit}'`);

        await Product.destroy({ });
    });

    it("should fail on invalid price", async () => {
        const createdProduct = await Product.create({
            name: 'Initial Product',
            price: 5000,
            quantity: 30,
            tag: 'initial'
        }).fetch();

        const mockBody = {
            id: createdProduct.id,
            price: 'invalid'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            failed: (data) => { result.exit = 'failed'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        };

        await updateOne.fn.call({ req: { body: mockBody } }, mockBody, exits);

        assert.strictEqual(result.exit, 'failed', `Expected exit 'failed' but got '${result.exit}'`);

        await Product.destroy({ });
    });
});
