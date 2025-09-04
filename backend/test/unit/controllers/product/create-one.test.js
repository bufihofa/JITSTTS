const assert = require('assert');
const createOne = require('../../../../api/controllers/product/create-one');
describe('- product/create-one', () => {
    console.log("Running product/create-one tests...");
    it("should success", async () => {
        const mockInputs = {
            name: 'Test Product',
            price: 10000,
            quantity: 50,
            tag: 'test'
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }
        await createOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.products, 'Missing products in response data');
        assert.strictEqual(result.data.products.name, mockInputs.name, 'Product name mismatch');
        assert.strictEqual(result.data.products.price, mockInputs.price, 'Product price mismatch');
        assert.strictEqual(result.data.products.quantity, mockInputs.quantity, 'Product quantity mismatch');
        assert.strictEqual(result.data.products.tag, mockInputs.tag, 'Product tag mismatch');
    
        await Product.destroy({ });
    });

    it("should fail on missing fields", async () => {
        const mockInputs = {
            name: '',
            price: null,
            quantity: null,
            tag: ''
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await createOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'badRequest', `Expected exit 'badRequest' but got '${result.exit}'`);
        
        await Product.destroy({ });
    });
});