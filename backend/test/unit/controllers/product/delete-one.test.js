const assert = require('assert');
const deleteOne = require('../../../../api/controllers/product/delete-one');

describe('- product/delete-one', () => {
    console.log("Running product/delete-one tests...");
    it("should success", async () => {
        const createdProduct = await Product.create({
            name: 'Product to Delete',
            price: 6000,
            quantity: 20,
            tag: 'delete'
        }).fetch();

        const mockInputs = {
            id: createdProduct.id
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            notFound: (data) => { result.exit = 'notFound'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await deleteOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);

        const recheck = await Product.findOne({ id: createdProduct.id });
        assert.strictEqual(recheck, undefined, 'Product was not deleted from database');
        
        await Product.destroy({ });
    });

    it("should fail on bad id", async () => {
        const mockInputs = {
            id: 98963123
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            notFound: (data) => { result.exit = 'notFound'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await deleteOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'notFound', `Expected exit 'notFound' but got '${result.exit}'`);
    });

    it("should fail on null id", async () => {
        const mockInputs = {
            name: 'Product'
        };

        const result = {};

        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            notFound: (data) => { result.exit = 'notFound'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }

        await deleteOne.fn(mockInputs, exits);

        assert.strictEqual(result.exit, 'notFound', `Expected exit 'notFound' but got '${result.exit}'`);
    });
});