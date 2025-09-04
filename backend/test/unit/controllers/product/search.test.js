const assert = require('assert');
const search = require('../../../../api/controllers/product/search');
describe('- product/search', () => {
    console.log("Running product/search tests...");
    it("should success", async () => {
        const createdProducts = await Product.createEach([
            { name: 'Apple iPhone', price: 999, quantity: 10, tag: 'electronics' },
            { name: 'Samsung Galaxy', price: 899, quantity: 15, tag: 'electronics' },
            { name: 'Dell Laptop', price: 1200, quantity: 5, tag: 'computers' },
            { name: 'HP Laptop', price: 1100, quantity: 8, tag: 'computers' },
            { name: 'Sony Headphones', price: 199, quantity: 20, tag: 'audio' },
            { name: 'Bose Speakers', price: 299, quantity: 12, tag: 'audio' },
            { name: 'Asus Laptop', price: 1300, quantity: 7, tag: 'computers' },
            { name: 'Lenovo Laptop', price: 1150, quantity: 9, tag: 'computers' },
            { name: 'Acer Laptop', price: 1050, quantity: 6, tag: 'computers' },
            { name: 'Microsoft Surface', price: 1400, quantity: 4, tag: 'computers' }
        ]).fetch();
        if(createdProducts) console.log("created products for testing ok");
        const mockInputs = {
            searchTerm: 'Laptop',
            limit: 3,
            page: 1
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }
        await search.fn(mockInputs, exits);
        console.log("checking result...");
        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.data, 'Missing products in response data');
        assert.strictEqual(result.data.data.length, 3, 'Expected 3 products in response data');
        assert.strictEqual(result.data.pagination.totalItems, 5, 'Expected total 5 products matching search');
        assert.strictEqual(result.data.pagination.totalPages, 2, 'Expected total 2 pages');
        assert.strictEqual(result.data.pagination.page, 1, 'Expected page 1');
        assert.strictEqual(result.data.pagination.limit, 3, 'Expected limit 3');
        console.log("checing done.");
        console.log("cleaning up test data...");
        await Product.destroy({});
    });

    it("sorting by price desc", async () => {
        const createdProducts = await Product.createEach([
            { name: 'Apple iPhone', price: 999, quantity: 10, tag: 'electronics' },
            { name: 'Samsung Galaxy', price: 899, quantity: 15, tag: 'electronics' },
            { name: 'Dell Laptop', price: 1200, quantity: 5, tag: 'computers' },
            { name: 'HP Laptop', price: 1100, quantity: 8, tag: 'computers' },
            { name: 'Sony Headphones', price: 199, quantity: 20, tag: 'audio' },
            { name: 'Bose Speakers', price: 299, quantity: 12, tag: 'audio' },
            { name: 'Asus Laptop', price: 1300, quantity: 7, tag: 'computers' },
            { name: 'Lenovo Laptop', price: 1150, quantity: 9, tag: 'computers' },
            { name: 'Acer Laptop', price: 1050, quantity: 6, tag: 'computers' },
            { name: 'Microsoft Surface', price: 1400, quantity: 4, tag: 'computers' }
        ]).fetch();
        if(createdProducts) console.log("created products for testing ok");
        const mockInputs = {
            searchTerm: 'Laptop',
            limit: 5,
            page: 1,
            sortBy: 'price',
            sortDirection: 'desc'
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }
        await search.fn(mockInputs, exits);
        console.log("checking result...");
        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.data, 'Missing products in response data');
        assert.strictEqual(result.data.data.length, 5, 'Expected 5 products in response data');
        for (let i = 1; i < result.data.data.length; i++) {
            assert.ok(result.data.data[i-1].price >= result.data.data[i].price, 'Products are not sorted by price desc');
        }
        console.log("checing done.");
        console.log("cleaning up test data...");
        await Product.destroy({});
    });

    it("sorting by tag asc", async () => {
        const createdProducts = await Product.createEach([
            { name: 'Apple iPhone', price: 999, quantity: 10, tag: 'electronics' },
            { name: 'Samsung Galaxy', price: 899, quantity: 15, tag: 'electronics' },
            { name: 'Dell Laptop', price: 1200, quantity: 5, tag: 'computers' },
            { name: 'HP Laptop', price: 1100, quantity: 8, tag: 'computers' },
            { name: 'Sony Headphones', price: 199, quantity: 20, tag: 'audio' },
            { name: 'Bose Speakers', price: 299, quantity: 12, tag: 'audio' },
            { name: 'Asus Laptop', price: 1300, quantity: 7, tag: 'computers' },
            { name: 'Lenovo Laptop', price: 1150, quantity: 9, tag: 'computers' },
            { name: 'Acer Laptop', price: 1050, quantity: 6, tag: 'computers' },
            { name: 'Microsoft Surface', price: 1400, quantity: 4, tag: 'computers' }
        ]).fetch();
        const mockInputs = {
            searchTerm: 'Laptop',
            limit: 5,
            page: 1,
            sortBy: 'tag',
            sortDirection: 'asc'
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }
        await search.fn(mockInputs, exits);
        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.data, 'Missing products in response data');
        assert.strictEqual(result.data.data.length, 5, 'Expected 5 products in response data');
        for (let i = 1; i < result.data.data.length; i++) {
            assert.ok(result.data.data[i-1].tag <= result.data.data[i].tag, 'Products are not sorted by tag asc');
        }

        await Product.destroy({});
    });

    it("pagination", async () => {
        const createdProducts = await Product.createEach([
            { name: 'Apple iPhone', price: 999, quantity: 10, tag: 'electronics' },
            { name: 'Samsung Galaxy', price: 899, quantity: 15, tag: 'electronics' },
            { name: 'Dell Laptop', price: 1200, quantity: 5, tag: 'computers' },
            { name: 'HP Laptop', price: 1100, quantity: 8, tag: 'computers' },
            { name: 'Sony Headphones', price: 199, quantity: 20, tag: 'audio' },
            { name: 'Bose Speakers', price: 299, quantity: 12, tag: 'audio' },
            { name: 'Asus Laptop', price: 1300, quantity: 7, tag: 'computers' },
            { name: 'Lenovo Laptop', price: 1150, quantity: 9, tag: 'computers' },
            { name: 'Acer Laptop', price: 1050, quantity: 6, tag: 'computers' },
            { name: 'Microsoft Surface', price: 1400, quantity: 4, tag: 'computers' }
        ]).fetch();
        const mockInputs = {
            searchTerm: 'Laptop',
            limit: 2,
            page: 2
        };
        const result = {};
        const exits = {
            success: (data) => { result.exit = 'success'; result.data = data; },
            badRequest: (data) => { result.exit = 'badRequest'; result.data = data; }
        }
        await search.fn(mockInputs, exits);
        assert.strictEqual(result.exit, 'success', `Expected exit 'success' but got '${result.exit}'`);
        assert.ok(result.data.data, 'Missing products in response data');
        assert.strictEqual(result.data.data.length, 2, 'Expected 2 products in response data');
        assert.strictEqual(result.data.pagination.totalItems, 5, 'Expected total 5 products matching search');
        assert.strictEqual(result.data.pagination.totalPages, 3, 'Expected total 3 pages');
        assert.strictEqual(result.data.pagination.page, 2, 'Expected page 2');
        assert.strictEqual(result.data.pagination.limit, 2, 'Expected limit 2');
        
        await Product.destroy({});
    });

});