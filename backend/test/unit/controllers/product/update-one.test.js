const assert = require('assert');
const updateOne = require('../../../../api/controllers/product/update-one');

describe('- product/update-one', () => {
    it("should success", async () => {
        const createdProduct = await Product.create({
            name: 'Initial Product',
            price: 5000,
            quantity: 30,
            tag: 'initial'
        }).fetch();

        const mockInputs = {
            id: createdProduct.id,
            name: 'Updated Product',
            price: 8000,
            quantity: 25,
            tag: 'updated'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            notFound: (data) => { result.exit = 'notFound'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await updateOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.finalProducts, 'Missing products in response data');
        assert.strictEqual(result.data.finalProducts.name, mockInputs.name, 'Product name mismatch');
        assert.strictEqual(result.data.finalProducts.price, mockInputs.price, 'Product price mismatch');
        assert.strictEqual(result.data.finalProducts.quantity, mockInputs.quantity, 'Product quantity mismatch');
        assert.strictEqual(result.data.finalProducts.tag, mockInputs.tag, 'Product tag mismatch');
        
        await Product.destroy({ });
    });

    it("should fail on missing id", async () => {
        const mockInputs = {
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
        }

        await updateOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'failed', `Expected exit 'failed' but got '${result.exit}'`);
        
        await Product.destroy({ });
    });
    
});